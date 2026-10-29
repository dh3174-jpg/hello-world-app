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
                background:
                    "linear-gradient(135deg, #2a1748 0%, #3a2470 45%, #1f4f8f 100%)",
                color: "#f8f5fb",
                padding: "24px",
            }}
        >
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    border: "1px solid #3a2b49",
                    borderRadius: "24px",
                    padding: "28px",
                    background: "rgba(23, 15, 31, 0.88)",
                    boxShadow: "0 24px 70px rgba(0, 0, 0, 0.24)",
                }}
            >
                <Navbar />

                <section style={{ maxWidth: "800px" }}>
                    <p
                        style={{
                            color: "#cfc5d9",
                            marginBottom: "12px",
                        }}
                    >
                        Hi {firstName} 👋
                    </p>

                    <h1
                        style={{
                            fontSize: "52px",
                            lineHeight: "1.05",
                            marginBottom: "16px",
                            letterSpacing: "-0.03em",
                        }}
                    >
                        Your moment, but better. ✨
                    </h1>

                    <p
                        style={{
                            fontSize: "20px",
                            color: "#d6d0db",
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
                            color: "#f3edf7",
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
                            background: "#21172b",
                            color: "#f8f5fb",
                            border: "1px solid #4a365d",
                            borderRadius: "16px",
                            padding: "18px",
                            fontSize: "17px",
                            resize: "vertical",
                            boxSizing: "border-box",
                            outline: "none",
                        }}
                    />

                    <div style={{ marginTop: "32px" }}>
                        <p
                            style={{
                                fontSize: "18px",
                                marginBottom: "14px",
                                color: "#f3edf7",
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
                                border: "1px solid #4a365d",
                                borderRadius: "18px",
                                background: "#21172b",
                                boxShadow:
                                    "0 18px 48px rgba(11, 5, 18, 0.22)",
                            }}
                        >
                            <p
                                style={{
                                    color: "#bda6ff",
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
                                    color: "#cfc5d9",
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
                                        border: "1px solid #5a436c",
                                        background: "#2a1d36",
                                        color: "#f8f5fb",
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
                                        color: "#160f1e",
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