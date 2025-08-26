// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET ?? "";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow Next internals and public assets
  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // Protect only the listed prefixes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/super")) {
    const token = await getToken({ req, secret });
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = (token as any).role as string | undefined;

    // For strict exclusivity:
    if (pathname.startsWith("/dashboard")) {
      // PARTNER only
      if (role !== "PARTNER") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    } else if (pathname.startsWith("/admin")) {
      // ADMIN only
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    } else if (pathname.startsWith("/super")) {
      // SUPERUSER only
      if (role !== "SUPERUSER") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  return NextResponse.next();
}

// matcher restricts middleware to only those paths
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/super/:path*"],
};
