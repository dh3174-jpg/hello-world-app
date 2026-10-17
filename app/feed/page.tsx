import Navbar from "@/app/components/navbar";
import FeedList from "./feed-list";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FeedPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: generations, error } = await supabase
        .from("generations")
        .select(`
        *,
        votes (
            user_id,
            vote
        )
    `)
        .order("created_at", { ascending: false });

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#050505",
                color: "#f5f5f5",
                padding: "24px",
            }}
        >
            <div
                style={{
                    maxWidth: "1000px",
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
                        Explore
                    </h1>

                    <p
                        style={{
                            color: "#bdbdbd",
                            fontSize: "18px",
                        }}
                    >
                        See AI-generated captions from the community and vote on
                        the ones you would actually use.
                    </p>
                </section>

                {generations?.length === 0 && (
                    <p style={{ color: "#a3a3a3" }}>
                        No captions have been generated yet.
                    </p>
                )}

                <div
                    style={{
                        display: "grid",
                        gap: "20px",
                    }}
                >
                    <FeedList
                        generations={generations || []}
                        userId={user.id}
                    />
                </div>
            </div>
        </main>
    );
}