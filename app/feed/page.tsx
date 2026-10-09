import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VoteButtons from "./vote-buttons";

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
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <main style={{ padding: "40px", maxWidth: "800px" }}>
            <h1>NYC Caption Feed</h1>

            <p>
                <a href="/">← Back Home</a>
            </p>

            <p>Rate AI-generated captions from other users.</p>

            {generations?.length === 0 && (
                <p>No captions have been generated yet.</p>
            )}

            {generations?.map((generation) => (
                <div
                    key={generation.id}
                    style={{
                        border: "1px solid white",
                        padding: "20px",
                        marginTop: "20px",
                    }}
                >
                    <p>
                        <strong>Prompt:</strong> {generation.prompt}
                    </p>

                    <p>
                        <strong>AI Caption:</strong> {generation.generated_text}
                    </p>

                    <VoteButtons
                        generationId={generation.id}
                        userId={user.id}
                    />
                </div>
            ))}
        </main>
    );
}