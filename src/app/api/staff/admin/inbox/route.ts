import { createClient as createServerClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Admin guard
    const supabase = await createServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Fetch enquiries
    const supabaseAdmin = createAdminClient();
    const { data: enquiries, error } = await supabaseAdmin
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Fetch Enquiries Error:", error);
      return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
    }

    return NextResponse.json(enquiries);

  } catch (error) {
    console.error("Inbox GET Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
