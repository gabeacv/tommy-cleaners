import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (typeof window !== 'undefined') {
      console.error("Supabase credentials missing in browser. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local");
    }
  }

  return createBrowserClient(
    supabaseUrl || "",
    supabaseKey || "",
    {
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      }
    }
  );
};


