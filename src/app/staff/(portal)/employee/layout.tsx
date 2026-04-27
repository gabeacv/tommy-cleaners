import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function EmployeeLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log("Employee Layout - User found:", user?.id || "None");

  if (!user) {
    redirect("/staff");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "employee") {
    // If an admin tries to access employee-only pages, we could redirect them to admin area
    redirect("/staff/admin/calendar");
  }

  return <>{children}</>;
}
