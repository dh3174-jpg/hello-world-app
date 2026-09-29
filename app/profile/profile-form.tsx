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
        <div>
            {avatar && (
                <div style={{ marginBottom: "20px" }}>
                    <img
                        src={avatar}
                        alt="Profile"
                        width={120}
                        height={120}
                        style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />
                </div>
            )}

            <div>
                <label>Profile photo</label>
                <br />

                <input
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />

                {uploading && <p>Uploading...</p>}
            </div>

            <br />

            <div>
                <label>First name</label>
                <br />

                <input
                    type="text"
                    value={first}
                    onChange={(e) => setFirst(e.target.value)}
                    style={{
                        border: "1px solid white",
                        padding: "8px",
                        marginTop: "5px",
                    }}
                />
            </div>

            <br />

            <div>
                <label>Last name</label>
                <br />

                <input
                    type="text"
                    value={last}
                    onChange={(e) => setLast(e.target.value)}
                    style={{
                        border: "1px solid white",
                        padding: "8px",
                        marginTop: "5px",
                    }}
                />
            </div>

            <br />

            <button
                type="button"
                onClick={updateProfile}
                disabled={saving}
                style={{
                    border: "1px solid white",
                    padding: "10px 16px",
                    cursor: "pointer",
                    backgroundColor: "white",
                    color: "black",
                }}
            >
                {saving ? "Saving..." : "Save Profile"}
            </button>

            {message && <p>{message}</p>}
        </div>
    );
}