import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StaffSidebar from "@/components/StaffSidebar";
import { ReactNode } from "react";
import { StaffProvider } from "@/contexts/StaffContext";

export default async function StaffLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log("Portal Layout - User:", user?.id || "None");

  if (!user) {
    redirect("/staff");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  console.log("Portal Layout - Profile Role:", profile?.role);
  const role = profile?.role || "employee";

  return (
    <StaffProvider role={role}>
      <div className="flex min-h-screen bg-cloud">
        <StaffSidebar role={role} />
        <main className="flex-1 w-full p-12 pb-20 md:pb-0 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </StaffProvider>
  );
}
