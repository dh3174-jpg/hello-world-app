// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomeCreate from "./home-create";

vi.mock("@/app/components/navbar", () => ({ default: () => null }));

const fetchCaption = vi.fn();
const prompt = "I found a quiet coffee shop.";
const customTone = "Playful but not too silly";
const toneLabel = "Describe the tone you want";

beforeEach(() => {
    fetchCaption.mockReset().mockImplementation(async () =>
        Response.json({ generatedText: "A little peace and a lot of coffee." })
    );
    vi.stubGlobal("fetch", fetchCaption);
    render(<HomeCreate firstName="Sam" />);
    fireEvent.change(screen.getByLabelText("What happened?"), { target: { value: prompt } });
});

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

function chooseTone(tone: string) {
    fireEvent.click(screen.getByRole("button", { name: tone }));
}

function generate() {
    fireEvent.click(screen.getByRole("button", { name: "Generate my caption" }));
}

async function expectCaptionRequest(payload: object) {
    await screen.findByRole("heading", { name: "A little peace and a lot of coffee." });
    expect(fetchCaption).toHaveBeenCalledOnce();
    expect(fetchCaption.mock.calls[0][0]).toBe("/api/generate");
    expect(JSON.parse(fetchCaption.mock.calls[0][1].body)).toEqual({ prompt, ...payload });
}

describe("caption tone selection", () => {
    it.each(["Casual", "Funny", "Thoughtful", "Professional"])("generates with %s", async (vibe) => {
        chooseTone(vibe);
        generate();
        await expectCaptionRequest({ vibe });
    });

    it("shows the custom field with Other selected", () => {
        expect(screen.queryByLabelText(toneLabel)).toBeNull();
        chooseTone("Other");
        expect(screen.getByRole("button", { name: "Other", pressed: true })).toBeTruthy();
        expect(screen.getByRole("textbox", { name: toneLabel })).toBeTruthy();
        expect(screen.getByText("Tell us exactly how you want the caption to feel.")).toBeTruthy();
    });

    it.each(["", "   "])("blocks generation with a blank custom tone (%j)", (value) => {
        chooseTone("Other");
        fireEvent.change(screen.getByLabelText(toneLabel), { target: { value } });
        generate();
        expect(fetchCaption).not.toHaveBeenCalled();
        expect(screen.getByRole("alert").textContent).toBe(
            "Describe the tone you want before generating a caption."
        );
    });

    it("sends the trimmed custom description", async () => {
        chooseTone("Other");
        fireEvent.change(screen.getByLabelText(toneLabel), { target: { value: `  ${customTone}  ` } });
        generate();
        await expectCaptionRequest({ vibe: "Other", customTone });
    });

    it("clears the custom description and resumes predefined generation when switching away", async () => {
        chooseTone("Other");
        fireEvent.change(screen.getByLabelText(toneLabel), { target: { value: customTone } });
        chooseTone("Thoughtful");
        expect(screen.queryByLabelText(toneLabel)).toBeNull();
        chooseTone("Other");
        expect((screen.getByLabelText(toneLabel) as HTMLTextAreaElement).value).toBe("");
        chooseTone("Thoughtful");
        generate();
        await expectCaptionRequest({ vibe: "Thoughtful" });
    });
});
