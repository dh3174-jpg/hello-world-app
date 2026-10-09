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

    const { prompt } = await request.json();

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

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `Create one funny, clever social-media caption about this NYC situation. Keep it short and appropriate for college students: ${prompt}`,
                            },
                        ],
                    },
                ],
            }),
        }
    );

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