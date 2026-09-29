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
        <main style={{ padding: "40px" }}>
            <h1>Profile</h1>

            <p>Signed in as {user.email}</p>

            <ProfileForm
                userId={user.id}
                firstName={profile?.first_name ?? ""}
                lastName={profile?.last_name ?? ""}
                avatarUrl={profile?.avatar_url ?? ""}
            />
        </main>
    );
}