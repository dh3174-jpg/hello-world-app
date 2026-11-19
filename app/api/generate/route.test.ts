import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { POST } from "./route";

const { insert } = vi.hoisted(() => ({ insert: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
    createClient: async () => ({
        auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
        from: () => ({ insert }),
    }),
}));

const fetchGemini = vi.fn();

beforeEach(() => {
    insert.mockReset().mockResolvedValue({ error: null });
    fetchGemini.mockReset().mockImplementation(async () =>
        Response.json({
            candidates: [{ content: { parts: [{ text: "Coffee with a side of calm." }] } }],
        })
    );
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal("fetch", fetchGemini);
});

afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
});

function generate(payload: object) {
    return POST(new Request("http://localhost/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt: "I found a quiet coffee shop.", ...payload }),
    }));
}

function sentPrompt() {
    return JSON.parse(fetchGemini.mock.calls[0][1].body).contents[0].parts[0].text;
}

it("keeps the predefined prompt instruction and stored category", async () => {
    const response = await generate({ vibe: "Funny", customTone: "Unused description" });
    expect(response.status).toBe(200);
    expect(sentPrompt()).toContain("Vibe: Funny\n\nMake the caption feel funny.");
    expect(sentPrompt()).not.toContain("Unused description");
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ vibe: "Funny" }));
});

it("uses the custom description as the only tone instruction", async () => {
    const response = await generate({ vibe: "Other", customTone: "  Playful but not too silly  " });
    expect(response.status).toBe(200);
    expect(sentPrompt()).toContain("Use this requested tone and style for the caption: Playful but not too silly\n");
    expect(sentPrompt()).not.toContain("Vibe:");
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ vibe: "Other" }));
});

it.each([undefined, "   "])("rejects missing or blank custom tone (%j)", async (customTone) => {
    const response = await generate({ vibe: "Other", customTone });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
        error: "Describe the tone you want before generating a caption.",
    });
    expect(fetchGemini).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
});
