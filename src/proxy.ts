import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function getLocale(request: NextRequest): string {
  const cookie = request.cookies.get("locale")?.value;
  if (cookie === "id" || cookie === "en") return cookie;

  const acceptLang = request.headers.get("accept-language") || "";
  if (acceptLang.startsWith("en")) return "en";

  return "id";
}

const publicPaths = ["/signin", "/api/auth/:path*", "/api/public/:path*", "/api/wilayah/:path*"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  const isSignInPage = pathname === "/signin";

  const response = NextResponse.next();

  if (!req.cookies.has("locale")) {
    const locale = getLocale(req);
    response.cookies.set("locale", locale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
  }

  const isPublicApi =
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/api/wilayah");

  if (isSignInPage || isPublicApi) {
    if (isSignInPage && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return response;
  }

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
