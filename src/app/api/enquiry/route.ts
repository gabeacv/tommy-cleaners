import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = (supabaseUrl && supabaseServiceRole) 
  ? createClient(supabaseUrl, supabaseServiceRole)
  : null;

export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Storage not configured." }, { status: 500 });
    }

    const body = await req.json();

    const { first_name, last_name, email, phone, property_type, area, message } = body;

    // 1. Save to Supabase
    const { error: dbError } = await supabaseAdmin
      .from("enquiries")
      .insert([
        { 
          first_name, 
          last_name, 
          email, 
          phone, 
          property_type, 
          area, 
          message,
          status: 'pending' 
        },
      ]);

    if (dbError) {
      console.error("Supabase Error:", dbError);
      return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
    }

    // 2. Send Email via Resend
    if (process.env.RESEND_API_KEY) {
        try {
            await resend.emails.send({
                from: "Tommy Cleaners <onboarding@resend.dev>",
                to: "hello@tommycleaners.com", // In production, this would be Tommy's email
                subject: `New Enquiry from ${first_name} ${last_name}`,
                html: `
                    <h1>New Enquiry Received</h1>
                    <p><strong>Name:</strong> ${first_name} ${last_name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Property:</strong> ${property_type}</p>
                    <p><strong>Area:</strong> ${area}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `,
            });
        } catch (emailError) {
            console.error("Resend Error:", emailError);
            // We don't fail the whole request if email fails, but we log it
        }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
