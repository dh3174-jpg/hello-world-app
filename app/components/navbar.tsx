"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "24px",
                flexWrap: "wrap",
                marginBottom: "60px",
            }}
        >
            <a
                href="/"
                className="brand-link"
            >
                ✧ hello world.
            </a>

            <nav
                style={{
                    display: "flex",
                    gap: "22px",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <a href="/" className="nav-link">
                    Create
                </a>

                <a href="/feed" className="nav-link">
                    Explore
                </a>

                <a href="/my-captions" className="nav-link">
                    My Captions
                </a>

                <a href="/profile" className="nav-link">
                    Profile
                </a>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Log out
                </button>
            </nav>
        </header>
    );
}