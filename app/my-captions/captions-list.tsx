"use client";

import { useState } from "react";
import CaptionActions from "./caption-actions";

type Caption = {
    id: number;
    prompt: string;
    generated_text: string;
    vibe: string | null;
    favorite: boolean | null;
    created_at: string;
};

export default function CaptionsList({
                                         captions,
                                     }: {
    captions: Caption[];
}) {
    const [filter, setFilter] =
        useState<"all" | "favorites">("all");

    const [captionList, setCaptionList] =
        useState<Caption[]>(captions);

    const handleDeleted = (captionId: number) => {
        setCaptionList((current) =>
            current.filter(
                (caption) => caption.id !== captionId
            )
        );
    };

    const handleFavoriteChange = (
        captionId: number,
        favorite: boolean
    ) => {
        setCaptionList((current) =>
            current.map((caption) =>
                caption.id === captionId
                    ? { ...caption, favorite }
                    : caption
            )
        );
    };

    const filteredCaptions =
        filter === "favorites"
            ? captionList.filter(
                (caption) => caption.favorite
            )
            : captionList;

    const favoriteCount = captionList.filter(
        (caption) => caption.favorite
    ).length;

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                gap: "30px",
                alignItems: "start",
            }}
        >
            <aside
                style={{
                    border: "1px solid #2f2f2f",
                    borderRadius: "16px",
                    padding: "18px",
                    background: "#0a0a0a",
                }}
            >
                <button
                    type="button"
                    onClick={() => setFilter("all")}
                    style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "none",
                        background:
                            filter === "all"
                                ? "#1f1635"
                                : "transparent",
                        color:
                            filter === "all"
                                ? "#a78bfa"
                                : "#ffffff",
                        cursor: "pointer",
                        marginBottom: "8px",
                    }}
                >
                    All Captions ({captionList.length})
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setFilter("favorites")
                    }
                    style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "none",
                        background:
                            filter === "favorites"
                                ? "#2a2308"
                                : "transparent",
                        color:
                            filter === "favorites"
                                ? "#facc15"
                                : "#ffffff",
                        cursor: "pointer",
                    }}
                >
                    ★ Favorites ({favoriteCount})
                </button>
            </aside>

            <section>
                {filteredCaptions.length === 0 && (
                    <div
                        style={{
                            border: "1px solid #2f2f2f",
                            borderRadius: "18px",
                            padding: "30px",
                            background: "#0a0a0a",
                            color: "#a3a3a3",
                        }}
                    >
                        {filter === "favorites"
                            ? "You haven't favorited any captions yet."
                            : "You haven't generated any captions yet."}
                    </div>
                )}

                <div
                    style={{
                        display: "grid",
                        gap: "20px",
                    }}
                >
                    {filteredCaptions.map((caption) => (
                        <div
                            key={caption.id}
                            style={{
                                border: "1px solid #2f2f2f",
                                borderRadius: "18px",
                                padding: "24px",
                                background: "#0a0a0a",
                            }}
                        >
                            <p
                                style={{
                                    color: "#a3a3a3",
                                    fontSize: "13px",
                                    marginBottom: "8px",
                                }}
                            >
                                ORIGINAL MOMENT
                            </p>

                            <p
                                style={{
                                    color: "#d4d4d4",
                                    marginBottom: "22px",
                                    lineHeight: "1.5",
                                }}
                            >
                                {caption.prompt}
                            </p>

                            <p
                                style={{
                                    color: "#a78bfa",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    marginBottom: "8px",
                                }}
                            >
                                AI-GENERATED CAPTION
                            </p>

                            <p
                                style={{
                                    fontSize: "24px",
                                    lineHeight: "1.5",
                                    marginBottom: "18px",
                                }}
                            >
                                {caption.generated_text}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    alignItems: "center",
                                    color: "#a3a3a3",
                                    fontSize: "14px",
                                }}
                            >
                                {caption.vibe && (
                                    <span>{caption.vibe}</span>
                                )}

                                <span>
                                    {new Date(
                                        caption.created_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            <CaptionActions
                                captionId={caption.id}
                                initialFavorite={
                                    caption.favorite ?? false
                                }
                                onDeleted={handleDeleted}
                                onFavoriteChange={
                                    handleFavoriteChange
                                }
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}