"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm({
                                        userId,
                                        firstName,
                                        lastName,
                                        avatarUrl,
                                    }: {
    userId: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
}) {
    const [first, setFirst] = useState(firstName);
    const [last, setLast] = useState(lastName);
    const [avatar, setAvatar] = useState(avatarUrl);
    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const supabase = createClient();

    const updateProfile = async () => {
        setSaving(true);
        setMessage("");

        const { error } = await supabase
            .from("profiles")
            .update({
                first_name: first,
                last_name: last,
                avatar_url: avatar,
            })
            .eq("id", userId);

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage("Profile saved!");
        }

        setSaving(false);
    };

    const uploadAvatar = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            setUploading(true);
            setMessage("");

            const file = event.target.files?.[0];

            if (!file) {
                setUploading(false);
                return;
            }

            const fileExt = file.name.split(".").pop();
            const filePath = `${userId}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            setAvatar(data.publicUrl);

            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    avatar_url: data.publicUrl,
                })
                .eq("id", userId);

            if (updateError) {
                throw updateError;
            }

            setMessage("Photo uploaded!");
        } catch (error) {
            if (error instanceof Error) {
                setMessage(`Error: ${error.message}`);
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            style={{
                border: "1px solid #2f2f2f",
                borderRadius: "20px",
                background: "#0a0a0a",
                padding: "28px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "22px",
                    marginBottom: "30px",
                    flexWrap: "wrap",
                }}
            >
                <div
                    style={{
                        width: "110px",
                        height: "110px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "1px solid #3a3a3a",
                        background: "#111111",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#737373",
                        fontSize: "14px",
                    }}
                >
                    {avatar ? (
                        <img
                            src={avatar}
                            alt="Profile"
                            width={110}
                            height={110}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <span>No photo</span>
                    )}
                </div>

                <div>
                    <p
                        style={{
                            margin: "0 0 8px",
                            fontSize: "16px",
                            fontWeight: 600,
                        }}
                    >
                        Profile photo
                    </p>

                    <label
                        style={{
                            display: "inline-block",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: "1px solid #3a3a3a",
                            background: "#111111",
                            color: "#ffffff",
                            cursor: uploading ? "not-allowed" : "pointer",
                        }}
                    >
                        {uploading ? "Uploading..." : "Choose photo"}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={uploadAvatar}
                            disabled={uploading}
                            style={{
                                display: "none",
                            }}
                        />
                    </label>

                    <p
                        style={{
                            marginTop: "10px",
                            marginBottom: 0,
                            color: "#737373",
                            fontSize: "13px",
                        }}
                    >
                        JPG, PNG, or other image formats supported by your browser.
                    </p>
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gap: "22px",
                }}
            >
                <div>
                    <label
                        htmlFor="first-name"
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontSize: "15px",
                            fontWeight: 500,
                        }}
                    >
                        First name
                    </label>

                    <input
                        id="first-name"
                        type="text"
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            border: "1px solid #3a3a3a",
                            borderRadius: "12px",
                            padding: "12px 14px",
                            background: "#111111",
                            color: "#ffffff",
                            fontSize: "16px",
                            outline: "none",
                        }}
                    />
                </div>

                <div>
                    <label
                        htmlFor="last-name"
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontSize: "15px",
                            fontWeight: 500,
                        }}
                    >
                        Last name
                    </label>

                    <input
                        id="last-name"
                        type="text"
                        value={last}
                        onChange={(e) => setLast(e.target.value)}
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            border: "1px solid #3a3a3a",
                            borderRadius: "12px",
                            padding: "12px 14px",
                            background: "#111111",
                            color: "#ffffff",
                            fontSize: "16px",
                            outline: "none",
                        }}
                    />
                </div>

                <button
                    type="button"
                    onClick={updateProfile}
                    disabled={saving}
                    style={{
                        width: "fit-content",
                        border: "none",
                        borderRadius: "12px",
                        padding: "12px 18px",
                        cursor: saving ? "not-allowed" : "pointer",
                        background: "#ffffff",
                        color: "#050505",
                        fontWeight: 600,
                        fontSize: "15px",
                        opacity: saving ? 0.6 : 1,
                    }}
                >
                    {saving ? "Saving..." : "Save Profile"}
                </button>

                {message && (
                    <p
                        style={{
                            margin: 0,
                            color: message.startsWith("Error")
                                ? "#fca5a5"
                                : "#86efac",
                            fontSize: "14px",
                        }}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}