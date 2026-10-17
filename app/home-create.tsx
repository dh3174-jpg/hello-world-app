"use client";

import { useState } from "react";
import Navbar from "@/app/components/navbar";

export default function HomeCreate({
                                       firstName,
                                   }: {
    firstName: string;
}) {
    const [moment, setMoment] = useState("");
    const [vibe, setVibe] = useState("Casual");
    const [generatedText, setGeneratedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const vibes = ["Casual", "Funny", "Thoughtful", "Professional"];

    const generateCaption = async () => {
        setLoading(true);
        setMessage("");
        setGeneratedText("");

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: moment,
                vibe,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setMessage(data.error || "Something went wrong.");
            setLoading(false);
            return;
        }

        setGeneratedText(data.generatedText);
        setLoading(false);
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#050505",
                color: "#f5f5f5",
                padding: "24px",
            }}
        >
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    border: "1px solid #2a2a2a",
                    borderRadius: "24px",
                    padding: "28px",
                }}
            >
                <Navbar />

                <section style={{ maxWidth: "800px" }}>
                    <p
                        style={{
                            color: "#a3a3a3",
                            marginBottom: "12px",
                        }}
                    >
                        Hi {firstName} 👋
                    </p>

                    <h1
                        style={{
                            fontSize: "48px",
                            marginBottom: "16px",
                        }}
                    >
                        Your moment, but better. ✨
                    </h1>

                    <p
                        style={{
                            fontSize: "20px",
                            color: "#bdbdbd",
                            lineHeight: "1.6",
                            marginBottom: "40px",
                        }}
                    >
                        Describe the moment, choose your vibe, and get an
                        AI-generated caption that sounds like you.
                    </p>

                    <label
                        htmlFor="moment"
                        style={{
                            display: "block",
                            fontSize: "18px",
                            marginBottom: "12px",
                        }}
                    >
                        What happened?
                    </label>

                    <textarea
                        id="moment"
                        value={moment}
                        onChange={(e) => setMoment(e.target.value)}
                        placeholder="Example: I finally found a quiet coffee shop after walking around the city for an hour."
                        rows={6}
                        className="caption-textarea"
                        style={{
                            width: "100%",
                            background: "#090909",
                            color: "#f5f5f5",
                            border: "1px solid #3a3a3a",
                            borderRadius: "16px",
                            padding: "18px",
                            fontSize: "17px",
                            resize: "vertical",
                            boxSizing: "border-box",
                        }}
                    />

                    <div style={{ marginTop: "32px" }}>
                        <p
                            style={{
                                fontSize: "18px",
                                marginBottom: "14px",
                            }}
                        >
                            What&apos;s your vibe?
                        </p>

                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                flexWrap: "wrap",
                            }}
                        >
                            {vibes.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setVibe(option)}
                                    className={`vibe-button ${
                                        vibe === option ? "vibe-selected" : ""
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={generateCaption}
                        disabled={!moment.trim() || loading}
                        className="generate-button"
                    >
                        {loading
                            ? "Creating your caption..."
                            : "Generate my caption"}
                    </button>

                    {message && (
                        <p
                            style={{
                                marginTop: "20px",
                                color: "#fca5a5",
                            }}
                        >
                            {message}
                        </p>
                    )}

                    {generatedText && (
                        <div
                            style={{
                                marginTop: "40px",
                                padding: "28px",
                                border: "1px solid #2f2f2f",
                                borderRadius: "18px",
                                background: "#0a0a0a",
                            }}
                        >
                            <p
                                style={{
                                    color: "#a78bfa",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    marginBottom: "10px",
                                }}
                            >
                                AI-GENERATED CAPTION
                            </p>

                            <h2
                                style={{
                                    fontSize: "28px",
                                    lineHeight: "1.4",
                                    margin: 0,
                                }}
                            >
                                {generatedText}
                            </h2>

                            <p
                                style={{
                                    color: "#a3a3a3",
                                    marginTop: "16px",
                                }}
                            >
                                Vibe: {vibe}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    marginTop: "24px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={generateCaption}
                                    disabled={loading}
                                    style={{
                                        padding: "11px 18px",
                                        borderRadius: "10px",
                                        border: "1px solid #3a3a3a",
                                        background: "#111111",
                                        color: "#f5f5f5",
                                        cursor: loading
                                            ? "not-allowed"
                                            : "pointer",
                                    }}
                                >
                                    ↻ Try another
                                </button>

                                <a
                                    href="/feed"
                                    style={{
                                        padding: "11px 18px",
                                        borderRadius: "10px",
                                        background: "#a78bfa",
                                        color: "#0a0a0a",
                                        fontWeight: 600,
                                        textDecoration: "none",
                                    }}
                                >
                                    Explore captions →
                                </a>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}