import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================
  // DEBUG MODE - Remove after fixing
  // ============================================
  const DEBUG = true;
  
  if (DEBUG) {
    console.log("\n=== MIDDLEWARE DEBUG ===");
    console.log("Path:", pathname);
    console.log("Method:", request.method);
  }

  // Skip API routes and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes("/public/")
  ) {
    if (DEBUG) console.log("Action: SKIP (static/api)");
    return NextResponse.next();
  }

  // Try to get token
  let token = null;
  try {
    token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (DEBUG) {
      console.log("Token:", token ? "EXISTS" : "NULL");
      if (token) {
        console.log("User:", (token.user as any)?.username);
        console.log("Role:", (token.user as any)?.role);
      }
    }
  } catch (error) {
    if (DEBUG) {
      console.log("Token Error:", error);
    }
  }

  // Check session cookie as fallback
  const sessionCookie = 
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");
  
  if (DEBUG) {
    console.log("Session Cookie:", sessionCookie ? "EXISTS" : "MISSING");
  }

  // Public paths
  const publicPaths = ["/login", "/dashboard"];
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + "/")
  );

  // Protected paths
  const protectedPaths = ["/budget-plan", "/transactions", "/user-management"];
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path)
  );

  if (DEBUG) {
    console.log("Public path:", isPublicPath);
    console.log("Protected path:", isProtectedPath);
  }

  // If accessing login while authenticated
  if ((token || sessionCookie) && pathname === "/login") {
    if (DEBUG) console.log("Action: REDIRECT (authenticated → dashboard)");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If accessing protected path without auth
  if (isProtectedPath && !token && !sessionCookie) {
    if (DEBUG) console.log("Action: REDIRECT (no auth → login)");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (DEBUG) {
    console.log("Action: ALLOW");
    console.log("========================\n");
  }

  // Allow through
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};