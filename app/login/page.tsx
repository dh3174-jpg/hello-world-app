"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const signInWithGoogle = async () => {
        const supabase = createClient();

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #3b1d6b 0%, #5b3aa8 50%, #2f6fb3 100%)",
                color: "#f8f5fb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    borderRadius: "26px",
                    background: "rgba(20, 15, 34, 0.88)",
                    padding: "42px",
                    boxShadow: "0 24px 70px rgba(0, 0, 0, 0.28)",
                    backdropFilter: "blur(12px)",
                }}
            >
                <p
                    style={{
                        margin: "0 0 34px",
                        fontSize: "48px",
                        lineHeight: "1",
                        fontWeight: 700,
                        letterSpacing: "-0.04em",
                        color: "#ffffff",
                    }}
                >
                    ✧ hello world.
                </p>

                <h1
                    style={{
                        margin: "0 0 14px",
                        fontSize: "40px",
                        lineHeight: "1.15",
                        letterSpacing: "-0.025em",
                    }}
                >
                    Your moment, but better. ✨
                </h1>

                <p
                    style={{
                        color: "#e7e0ef",
                        fontSize: "17px",
                        lineHeight: "1.6",
                        marginBottom: "32px",
                    }}
                >
                    Turn everyday moments into AI-generated captions,
                    explore what others create, and vote on the ones
                    you&apos;d actually use.
                </p>

                <button
                    type="button"
                    onClick={signInWithGoogle}
                    style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                        background: "#ffffff",
                        color: "#241238",
                        fontSize: "16px",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition:
                            "transform 0.15s ease, box-shadow 0.15s ease",
                        boxShadow:
                            "0 8px 24px rgba(115, 87, 188, 0.24)",
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.transform = "scale(0.97)";
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                >
                    Continue with Google
                </button>

                <p
                    style={{
                        marginTop: "22px",
                        marginBottom: 0,
                        color: "#c9bfd3",
                        fontSize: "13px",
                        lineHeight: "1.5",
                    }}
                >
                    Sign in to create captions, save your favorites,
                    manage your history, and vote in Explore.
                </p>
            </div>
        </main>
    );
}