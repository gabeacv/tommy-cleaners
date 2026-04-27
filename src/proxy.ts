import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({

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
          const cookieOptions = {
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
          };
          request.cookies.set({
            name,
            value,
            ...cookieOptions,
          });
          response.cookies.set({
            name,
            value,
            ...cookieOptions,
          });
        },
        remove(name: string, options: CookieOptions) {
          const cookieOptions = {
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
          };
          request.cookies.set({
            name,
            value: "",
            ...cookieOptions,
          });
          response.cookies.set({
            name,
            value: "",
            ...cookieOptions,
          });
        },
      },
    }
  );

  const syncCookies = (from: NextResponse, to: NextResponse) => {
    from.cookies.getAll().forEach((cookie) => {
      to.cookies.set(cookie.name, cookie.value, cookie);
    });
    return to;
  };

  const { data: { user } } = await supabase.auth.getUser();

  // Protect staff routes
  if (request.nextUrl.pathname.startsWith("/staff")) {
    // Exclude login and reset-password
    const isPublic = request.nextUrl.pathname === "/staff" || request.nextUrl.pathname === "/staff/reset-password";
    
    if (!user && !isPublic) {
      console.log("Middleware - No user found, redirecting to login");
      return syncCookies(response, NextResponse.redirect(new URL("/staff", request.url)));
    }

    if (user) {
        let role = 'employee';
        try {
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .maybeSingle();
            if (profile?.role) role = profile.role;
        } catch (e) {
            console.error("Middleware Role Check Error:", e);
        }

        // Redirect based on role if already on login page
        if (isPublic) {
            const dest = role === 'admin' ? "/staff/admin/calendar" : "/staff/employee/calendar";
            return syncCookies(response, NextResponse.redirect(new URL(dest, request.url)));
        }

        // Authenticated + role !== 'admin' on any /staff/admin/* → redirect /staff/employee/calendar
        if (request.nextUrl.pathname.startsWith("/staff/admin") && role !== 'admin') {
            return syncCookies(response, NextResponse.redirect(new URL("/staff/employee/calendar", request.url)));
        }
    }
  }

  return response;
}

export default proxy;

export const config = {
  matcher: ["/staff/:path*"],
};
