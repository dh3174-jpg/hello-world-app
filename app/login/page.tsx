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
                background: "#050505",
                color: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "460px",
                    border: "1px solid #2f2f2f",
                    borderRadius: "24px",
                    background: "#0a0a0a",
                    padding: "36px",
                }}
            >
                <p
                    style={{
                        margin: "0 0 36px",
                        fontSize: "22px",
                        fontWeight: 600,
                    }}
                >
                    ✧ hello world.
                </p>

                <h1
                    style={{
                        margin: "0 0 14px",
                        fontSize: "38px",
                        lineHeight: "1.15",
                    }}
                >
                    Your moment, but better. ✨
                </h1>

                <p
                    style={{
                        color: "#a3a3a3",
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
                        border: "1px solid #3a3a3a",
                        background: "#ffffff",
                        color: "#050505",
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "transform 0.15s ease",
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
                        color: "#737373",
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