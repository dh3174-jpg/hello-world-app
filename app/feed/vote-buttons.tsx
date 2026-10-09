"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function VoteButtons({
                                        generationId,
                                        userId,
                                    }: {
    generationId: number;
    userId: string;
}) {
    const [message, setMessage] = useState("");
    const supabase = createClient();

    const submitVote = async (vote: number) => {
        setMessage("");

        const { error } = await supabase
            .from("votes")
            .upsert(
                {
                    user_id: userId,
                    generation_id: generationId,
                    vote,
                },
                {
                    onConflict: "user_id,generation_id",
                }
            );

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage(vote === 1 ? "Upvoted!" : "Downvoted!");
        }
    };

    return (
        <div style={{ marginTop: "15px" }}>
            <button
                type="button"
                onClick={() => submitVote(1)}
                style={{
                    padding: "8px 12px",
                    marginRight: "10px",
                    cursor: "pointer",
                }}
            >
                👍 Upvote
            </button>

            <button
                type="button"
                onClick={() => submitVote(-1)}
                style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                }}
            >
                👎 Downvote
            </button>

            {message && <p>{message}</p>}
        </div>
    );
}