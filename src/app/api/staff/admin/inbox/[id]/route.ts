import { createClient as createServerClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const UpdateStatusSchema = z.object({
  status: z.enum(['new', 'reviewed', 'archived'])
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // 2. Validate body
    const body = await req.json();
    const validation = UpdateStatusSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid status', 
        details: validation.error.flatten() 
      }, { status: 400 });
    }

    const { status } = validation.data;

    // 3. Update enquiry
    const supabaseAdmin = createAdminClient();
    const { data: updated, error } = await supabaseAdmin
      .from('enquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Update Enquiry Error:", error);
      return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 });
    }

    return NextResponse.json(updated);

  } catch (error) {
    console.error("Inbox PATCH Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
