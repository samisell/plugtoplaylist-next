import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function UserDashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const adminClient = createAdminClient();

  let { data: userData, error: userError } = await adminClient
    .from("users" as any)
    .select("*")
    .eq("id", user.id)
    .single();

  if (!userData && user) {
     const newActiveUser = {
         id: user.id,
         email: user.email,
         display_name: user.user_metadata?.full_name || "New User",
         role: "user",
         metadata: { referral_code: Math.random().toString(36).substring(2, 8).toUpperCase() }
     };
     await adminClient.from("users" as any).insert(newActiveUser);
     userData = newActiveUser;
  }

  const { data: submissions } = await adminClient
    .from("submissions" as any)
    .select(`*, plan:plans (*), payment:payments (*)`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <DashboardClient user={userData} submissions={submissions || []} />;
}