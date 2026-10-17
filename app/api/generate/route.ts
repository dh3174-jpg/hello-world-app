import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            { error: "You must be logged in." },
            { status: 401 }
        );
    }

    const { prompt, vibe = "Casual" } = await request.json();

    if (!prompt) {
        return NextResponse.json(
            { error: "Prompt is required." },
            { status: 400 }
        );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "Gemini API key is missing." },
            { status: 500 }
        );
    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 15000);

    let response: Response;

    try {
        response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Create one social-media caption based on the user's moment.

Moment: ${prompt}
Vibe: ${vibe}

Make the caption feel ${vibe.toLowerCase()}.
Keep the original meaning of the moment, but make the wording more engaging and natural.
Keep it short and social-media friendly, ideally one sentence and under 20 words.
Return only the caption itself, with no explanation or quotation marks.`,
                                },
                            ],
                        },
                    ],
                }),
            }
        );
    } catch (error) {
        clearTimeout(timeout);

        return NextResponse.json(
            {
                error: "The AI is taking too long right now. Please try again.",
            },
            { status: 504 }
        );
    }

    clearTimeout(timeout);

    const result = await response.json();

    if (!response.ok) {
        return NextResponse.json(
            { error: result?.error?.message ?? "Gemini request failed." },
            { status: 500 }
        );
    }

    const generatedText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!generatedText) {
        return NextResponse.json(
            { error: "Gemini returned no text." },
            { status: 500 }
        );
    }

    const { error: insertError } = await supabase
        .from("generations")
        .insert({
            user_id: user.id,
            prompt,
            generated_text: generatedText,
            vibe,
        });

    if (insertError) {
        return NextResponse.json(
            { error: insertError.message },
            { status: 500 }
        );
    }

    return NextResponse.json({
        generatedText,
    });
}