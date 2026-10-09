"use client";

import { useState } from "react";

export default function GeneratePage() {
    const [prompt, setPrompt] = useState("");
    const [generatedText, setGeneratedText] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const generateCaption = async () => {
        setLoading(true);
        setMessage("");
        setGeneratedText("");

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();

        if (!response.ok) {
            setMessage(data.error || "Something went wrong.");
            setLoading(false);
            return;
        }

        setGeneratedText(data.generatedText);
        setMessage("Caption generated and saved!");
        setLoading(false);
    };


    return (
        <main style={{ padding: "40px", maxWidth: "700px" }}>
            <h1>Generate an NYC Caption</h1>

            <p>
                <a href="/">← Back Home</a>
            </p>

            <p>
                Describe a funny NYC situation and let AI generate a caption for it.
            </p>

            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Waiting 20 minutes for the train and then three arrive at once"
                rows={5}
                style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "20px",
                }}
            />

            <br />
            <br />

            <button
                type="button"
                onClick={generateCaption}
                disabled={loading || !prompt.trim()}
                style={{
                    padding: "12px 18px",
                    cursor: "pointer",
                }}
            >
                {loading ? "Generating..." : "Generate Caption"}
            </button>

            {message && <p>{message}</p>}

            {generatedText && (
                <div style={{ marginTop: "30px" }}>
                    <h2>Generated Caption</h2>
                    <p>{generatedText}</p>
                </div>
            )}
        </main>
    );
}