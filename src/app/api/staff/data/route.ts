import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceRole) {
            return NextResponse.json({ error: "Supabase service role not configured." }, { status: 500 });
        }

        // 1. Get user session to verify role
        const supabaseUserClient = await createServerClient();
        const { data: { user } } = await supabaseUserClient.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Fetch profile role
        const { data: profile } = await supabaseUserClient
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        const role = profile?.role || 'employee';

        // Initialize Admin Client (Bypasses RLS)
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

        const url = new URL(req.url);
        const type = url.searchParams.get("type");

        // Guard for admin-only data types
        if ((type === "employees" || type === "all_clients") && role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 4. Fetch data based on role and type
        if (type === "clients") {
            if (role === 'admin') {
                const { data } = await supabaseAdmin.from("clients").select("*");
                return NextResponse.json(data);
            } else {
                const { data } = await supabaseAdmin
                    .from("clients")
                    .select("*")
                    .eq("assigned_employee_id", user.id);
                return NextResponse.json(data);
            }
        }

        if (type === "employees" && role === 'admin') {
            const { data } = await supabaseAdmin.from("profiles").select("*");
            return NextResponse.json(data);
        }

        if (type === "appointments") {
            if (role === 'admin') {
                const { data } = await supabaseAdmin.from("appointments").select("*, clients(*)");
                return NextResponse.json(data);
            } else {
                const { data } = await supabaseAdmin
                    .from("appointments")
                    .select("*, clients(*)")
                    .eq("employee_id", user.id);
                return NextResponse.json(data);
            }
        }

        return NextResponse.json({ error: "Invalid request or insufficient permissions" }, { status: 400 });

    } catch (error) {
        console.error("Staff Data API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
