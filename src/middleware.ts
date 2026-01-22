import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js Middleware - JWT token refresh gate.
 * Runs on EVERY request before Route Handlers or Server Components execute.
 * 
 * Exclusions: Static assets, images (to avoid unnecessary processing)
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Exclude static files and images from middleware to reduce overhead
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
