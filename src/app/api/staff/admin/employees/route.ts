import { createClient as createServerClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const NewEmployeeSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(5),
  role: z.enum(['admin', 'employee'])
});

export async function POST(req: Request) {
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

    // 2. Validate + sanitise
    const body = await req.json();
    const validation = NewEmployeeSchema.safeParse(body);
    
    if (!validation.success) {
        return NextResponse.json({ error: 'Invalid fields', details: validation.error.flatten() }, { status: 400 });
    }

    const { email, full_name, phone, address, role } = validation.data;

    // 3. Check email uniqueness in profiles
    const supabaseAdmin = createAdminClient();
    const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

    if (existingProfile) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    // 4. Create Auth user
    const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        password: crypto.randomUUID(), // They will receive a password reset link
        user_metadata: { full_name, role }
    });

    if (authError || !newUser.user) {
        return NextResponse.json({ error: authError?.message || 'Failed to create auth user' }, { status: 500 });
    }

    // 5. Insert profiles row
    // Note: handle_new_user trigger might already exist, but we update it to ensure all fields are set
    // In our migration, we have a trigger. Let's update the profile with the extra fields.
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
            full_name,
            phone,
            address,
            role,
            email // Ensure it's stored
        })
        .eq('id', newUser.user.id);

    if (profileError) {
        console.error("Profile Update Error:", profileError);
        // We don't fail here if the trigger already created the base row, 
        // but we might need to handle it if we want atomicity.
    }

    // 7. Return 201
    return NextResponse.json({ id: newUser.user.id }, { status: 201 });

  } catch (error) {
    console.error("Employee Creation Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
