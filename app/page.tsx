import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HomeCreate from "./home-create";

export default async function Home() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

    if (!profile?.first_name || !profile?.last_name) {
        redirect("/profile");
    }

    return <HomeCreate firstName={profile.first_name} />;
}