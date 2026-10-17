import Navbar from "@/app/components/navbar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", user.id)
        .single();

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
                    maxWidth: "1100px",
                    margin: "0 auto",
                }}
            >
                <Navbar />

                <section style={{ maxWidth: "700px" }}>
                    <h1
                        style={{
                            fontSize: "44px",
                            marginBottom: "12px",
                        }}
                    >
                        Profile
                    </h1>

                    <p
                        style={{
                            color: "#bdbdbd",
                            marginBottom: "30px",
                        }}
                    >
                        Signed in as {user.email}
                    </p>

                    <ProfileForm
                        userId={user.id}
                        firstName={profile?.first_name ?? ""}
                        lastName={profile?.last_name ?? ""}
                        avatarUrl={profile?.avatar_url ?? ""}
                    />
                </section>
            </div>
        </main>
    );
}