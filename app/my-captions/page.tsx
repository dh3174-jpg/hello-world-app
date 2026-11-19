import Navbar from "@/app/components/navbar";
import CaptionsList from "./captions-list";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MyCaptionsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: captions, error } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <main className="consumer-page consumer-page--history">
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                }}
            >
                <Navbar />

                <section style={{ marginBottom: "40px" }}>
                    <h1
                        style={{
                            fontSize: "44px",
                            marginBottom: "12px",
                        }}
                    >
                        My Captions
                    </h1>

                    <p
                        style={{
                            color: "var(--page-muted)",
                            fontSize: "18px",
                        }}
                    >
                        Your AI-generated caption history, all in one place.
                    </p>
                </section>

                {captions?.length === 0 && (
                    <p style={{ color: "var(--page-muted)" }}>
                        You haven&apos;t generated any captions yet.
                    </p>
                )}

                <div
                    style={{
                        display: "grid",
                        gap: "20px",
                    }}
                >
                    <CaptionsList captions={captions || []}
                    />
                </div>
            </div>
        </main>
    );
}