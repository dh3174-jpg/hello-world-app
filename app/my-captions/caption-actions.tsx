"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CaptionActions({
                                           captionId,
                                           initialFavorite,
                                           onDeleted,
                                           onFavoriteChange,
                                       }: {
    captionId: number;
    initialFavorite: boolean;
    onDeleted: (captionId: number) => void;
    onFavoriteChange: (captionId: number, favorite: boolean) => void;
}) {
    const supabase = createClient();

    const [favorite, setFavorite] = useState(initialFavorite);
    const [deleting, setDeleting] = useState(false);

    const toggleFavorite = async () => {
        const oldFavorite = favorite;
        const newFavorite = !favorite;

        setFavorite(newFavorite);
        onFavoriteChange(captionId, newFavorite);

        const { error } = await supabase
            .from("generations")
            .update({ favorite: newFavorite })
            .eq("id", captionId);

        if (error) {
            console.error(error);
            setFavorite(oldFavorite);
            onFavoriteChange(captionId, oldFavorite);
            alert("Favorite could not be saved. Please try again.");
        }
    };

    const deleteCaption = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this caption?"
        );

        if (!confirmed) return;

        setDeleting(true);

        const { error } = await supabase
            .from("generations")
            .delete()
            .eq("id", captionId);

        if (error) {
            console.error(error);
            setDeleting(false);
            alert("The caption could not be deleted.");
            return;
        }

        onDeleted(captionId);
    };

    return (
        <div
            style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
                flexWrap: "wrap",
            }}
        >
            <button
                type="button"
                onClick={toggleFavorite}
                className={`caption-action-button favorite-action ${
                    favorite ? "favorite-active" : ""
                }`}
            >
                <span
                    style={{
                        fontSize: "18px",
                        lineHeight: 1,
                    }}
                >
                    {favorite ? "★" : "☆"}
                </span>

                <span>
                    {favorite ? "Favorited" : "Favorite"}
                </span>
            </button>

            <button
                type="button"
                onClick={deleteCaption}
                disabled={deleting}
                className="caption-action-button delete-action"
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v5" />
                    <path d="M14 11v5" />
                </svg>

                <span>
                    {deleting ? "Deleting..." : "Delete"}
                </span>
            </button>
        </div>
    );
}