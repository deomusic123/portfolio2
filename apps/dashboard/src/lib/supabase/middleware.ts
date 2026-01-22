import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../constants";

/**
 * Middleware session refresher.
 * CRITICAL: This must refresh JWT BEFORE Server Components execute.
 * Failure to refresh leads to "token expired" errors on RSC data fetching.
 * 
 * Security: Uses getUser() not getSession() for server-side validation.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Validate Supabase credentials exist - skip auth in dev without credentials
  const hasValidConfig = SUPABASE_URL && 
                         SUPABASE_ANON_KEY && 
                         SUPABASE_URL.startsWith('http') &&
                         !SUPABASE_URL.includes('your_supabase');
  
  if (!hasValidConfig) {
    console.warn('⚠️  Supabase credentials not configured - Auth disabled');
    return response;
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Validate user and refresh session
  const { data: { user } } = await supabase.auth.getUser();

  // Route protection: redirect to login if not authenticated
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") ||
                      request.nextUrl.pathname.startsWith("/register") ||
                      request.nextUrl.pathname === "/";

  if (!user && !isAuthRoute && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}
