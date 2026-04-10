import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({

    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // If Supabase is not configured, we only allow access to the public marketing site.
    // We can't perform any role-based checks or session management.
    if (request.nextUrl.pathname.startsWith("/staff") && request.nextUrl.pathname !== "/staff") {
       console.warn("Supabase credentials missing. Access to staff portal is restricted.");
       return NextResponse.redirect(new URL("/staff", request.url));
    }
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {

      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect staff routes
  if (request.nextUrl.pathname.startsWith("/staff")) {
    // Exclude login and reset-password
    const isPublic = request.nextUrl.pathname === "/staff" || request.nextUrl.pathname === "/staff/reset-password";
    
    if (!user && !isPublic) {
      return NextResponse.redirect(new URL("/staff", request.url));
    }

    if (user && isPublic) {
        // Redirect based on role if already logged in
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();

        if (profile?.role === 'admin') {
            return NextResponse.redirect(new URL("/staff/admin/calendar", request.url));
        } else {
            // Default to employee if no profile found or role is employee
            return NextResponse.redirect(new URL("/staff/employee/calendar", request.url));
        }
    }
  }

  return response;
}

export default proxy;

export const config = {
  matcher: ["/staff/:path*"],
};
