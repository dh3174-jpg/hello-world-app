"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Vote = {
    user_id: string;
    vote: number;
};

export default function VoteButtons({
                                        generationId,
                                        userId,
                                        votes,
                                    }: {
    generationId: number;
    userId: string;
    votes: Vote[];
}) {
    const supabase = createClient();

    const initialUserVote =
        votes.find((vote) => vote.user_id === userId)?.vote ?? 0;

    const initialUpvotes = votes.filter((vote) => vote.vote === 1).length;
    const initialDownvotes = votes.filter((vote) => vote.vote === -1).length;

    const [userVote, setUserVote] = useState(initialUserVote);
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);

    const [upBounce, setUpBounce] = useState(false);
    const [downBounce, setDownBounce] = useState(false);

    const submitVote = async (newVote: number) => {
        const previousVote = userVote;

        // Clicking the selected vote again removes the vote
        if (previousVote === newVote) {
            const { error } = await supabase
                .from("votes")
                .delete()
                .eq("user_id", userId)
                .eq("generation_id", generationId);

            if (error) {
                console.error(error);
                return;
            }

            if (newVote === 1) {
                setUpvotes((count) => Math.max(0, count - 1));
                setUpBounce(true);

                setTimeout(() => {
                    setUpBounce(false);
                }, 250);
            }

            if (newVote === -1) {
                setDownvotes((count) => Math.max(0, count - 1));
                setDownBounce(true);

                setTimeout(() => {
                    setDownBounce(false);
                }, 250);
            }

            setUserVote(0);
            return;
        }

        // Otherwise create or switch the vote
        const { error } = await supabase
            .from("votes")
            .upsert(
                {
                    user_id: userId,
                    generation_id: generationId,
                    vote: newVote,
                },
                {
                    onConflict: "user_id,generation_id",
                }
            );

        if (error) {
            console.error(error);
            return;
        }

        // Remove the previous vote from the displayed count
        if (previousVote === 1) {
            setUpvotes((count) => Math.max(0, count - 1));
        }

        if (previousVote === -1) {
            setDownvotes((count) => Math.max(0, count - 1));
        }

        // Add the new vote
        if (newVote === 1) {
            setUpvotes((count) => count + 1);
            setUpBounce(true);

            setTimeout(() => {
                setUpBounce(false);
            }, 250);
        }

        if (newVote === -1) {
            setDownvotes((count) => count + 1);
            setDownBounce(true);

            setTimeout(() => {
                setDownBounce(false);
            }, 250);
        }

        setUserVote(newVote);
    };

    return (
        <div style={{ marginTop: "22px" }}>
            <p
                style={{
                    color: "#bdbdbd",
                    fontSize: "14px",
                    marginBottom: "12px",
                }}
            >
                Would you use this caption?
            </p>

            <div
                style={{
                    display: "flex",
                    gap: "12px",
                }}
            >
                <button
                    type="button"
                    onClick={() => submitVote(1)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 16px",
                        borderRadius: "999px",
                        border:
                            userVote === 1
                                ? "1px solid #a78bfa"
                                : "1px solid #3a3a3a",
                        background:
                            userVote === 1
                                ? "#1f1635"
                                : "#111111",
                        color:
                            userVote === 1
                                ? "#a78bfa"
                                : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        transform: upBounce
                            ? "translateY(-5px) scale(1.05)"
                            : "translateY(0) scale(1)",
                    }}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M7 10v12" />
                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                    </svg>

                    <span>{upvotes}</span>
                </button>

                <button
                    type="button"
                    onClick={() => submitVote(-1)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 16px",
                        borderRadius: "999px",
                        border:
                            userVote === -1
                                ? "1px solid #60a5fa"
                                : "1px solid #3a3a3a",
                        background:
                            userVote === -1
                                ? "#10213d"
                                : "#111111",
                        color:
                            userVote === -1
                                ? "#60a5fa"
                                : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        transform: downBounce
                            ? "translateY(5px) scale(1.05)"
                            : "translateY(0) scale(1)",
                    }}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M17 14V2" />
                        <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                    </svg>

                    <span>{downvotes}</span>
                </button>
            </div>
        </div>
    );
}