"use client";

import { useState } from "react";
import VoteButtons from "./vote-buttons";

type Vote = {
    user_id: string;
    vote: number;
};

type Generation = {
    id: number;
    user_id: string;
    prompt: string;
    generated_text: string;
    vibe: string | null;
    created_at: string;
    votes: Vote[];
};

export default function FeedList({
                                     generations,
                                     userId,
                                 }: {
    generations: Generation[];
    userId: string;
}) {
    const [filter, setFilter] = useState("All");
    const [sort, setSort] = useState<"newest" | "top">("newest");

    const filters = [
        "All",
        "Funny",
        "Casual",
        "Thoughtful",
        "Professional",
    ];

    const filteredGenerations =
        filter === "All"
            ? generations
            : generations.filter(
                (generation) => generation.vibe === filter
            );

    const sortedGenerations = [...filteredGenerations].sort((a, b) => {
        if (sort === "top") {
            const aScore = (a.votes || []).reduce(
                (total, vote) => total + vote.vote,
                0
            );

            const bScore = (b.votes || []).reduce(
                (total, vote) => total + vote.vote,
                0
            );

            return bScore - aScore;
        }

        return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
    });

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "18px",
                }}
            >
                {filters.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => setFilter(option)}
                        style={{
                            padding: "10px 16px",
                            borderRadius: "999px",
                            border:
                                filter === option
                                    ? "1px solid #a78bfa"
                                    : "1px solid #3a3a3a",
                            background:
                                filter === option
                                    ? "#1f1635"
                                    : "#111111",
                            color:
                                filter === option
                                    ? "#a78bfa"
                                    : "#ffffff",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "30px",
                    flexWrap: "wrap",
                }}
            >
                <button
                    type="button"
                    onClick={() => setSort("newest")}
                    style={{
                        padding: "8px 14px",
                        borderRadius: "10px",
                        border:
                            sort === "newest"
                                ? "1px solid #a78bfa"
                                : "1px solid #3a3a3a",
                        background:
                            sort === "newest"
                                ? "#1f1635"
                                : "#111111",
                        color:
                            sort === "newest"
                                ? "#a78bfa"
                                : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                >
                    Newest
                </button>

                <button
                    type="button"
                    onClick={() => setSort("top")}
                    style={{
                        padding: "8px 14px",
                        borderRadius: "10px",
                        border:
                            sort === "top"
                                ? "1px solid #a78bfa"
                                : "1px solid #3a3a3a",
                        background:
                            sort === "top"
                                ? "#1f1635"
                                : "#111111",
                        color:
                            sort === "top"
                                ? "#a78bfa"
                                : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                >
                    Top Rated
                </button>
            </div>

            {sortedGenerations.length === 0 && (
                <div
                    style={{
                        border: "1px solid #2f2f2f",
                        borderRadius: "18px",
                        padding: "30px",
                        background: "#0a0a0a",
                        color: "#a3a3a3",
                    }}
                >
                    No {filter.toLowerCase()} captions yet.
                </div>
            )}

            <div
                style={{
                    display: "grid",
                    gap: "20px",
                }}
            >
                {sortedGenerations.map((generation) => (
                    <div
                        key={generation.id}
                        style={{
                            border: "1px solid #2f2f2f",
                            borderRadius: "18px",
                            padding: "24px",
                            background: "#0a0a0a",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "16px",
                                marginBottom: "12px",
                            }}
                        >
                            <p
                                style={{
                                    color: "#a78bfa",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    margin: 0,
                                }}
                            >
                                AI-GENERATED CAPTION
                            </p>

                            {generation.vibe && (
                                <span
                                    style={{
                                        padding: "6px 10px",
                                        borderRadius: "999px",
                                        border: "1px solid #3a3a3a",
                                        color: "#bdbdbd",
                                        fontSize: "12px",
                                    }}
                                >
                                    {generation.vibe}
                                </span>
                            )}
                        </div>

                        <p
                            style={{
                                fontSize: "24px",
                                lineHeight: "1.5",
                                marginBottom: "20px",
                            }}
                        >
                            {generation.generated_text}
                        </p>

                        <details
                            style={{
                                color: "#a3a3a3",
                                marginBottom: "18px",
                            }}
                        >
                            <summary
                                style={{
                                    cursor: "pointer",
                                }}
                            >
                                See original moment
                            </summary>

                            <p
                                style={{
                                    marginTop: "10px",
                                    lineHeight: "1.5",
                                }}
                            >
                                {generation.prompt}
                            </p>
                        </details>

                        <VoteButtons
                            generationId={generation.id}
                            userId={userId}
                            votes={generation.votes || []}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}