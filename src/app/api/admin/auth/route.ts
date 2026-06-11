import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { verifyCsrf } from "@/lib/csrf";

const ADMIN_PASSWORD = "12512595";

function setAdminCookie(response: NextResponse) {
  response.cookies.set("admin_session", "authenticated", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 604800, // 7 days
  });
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request, "admin-login");
    if (!rateLimit(rateLimitKey, 5, 300000)) {
      return NextResponse.json({ error: "Trop de tentatives. Reessayez dans 5 minutes." }, { status: 429 });
    }

    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: "Requete non autorisee" }, { status: 403 });
    }

    const body = await request.json();

    // Method 1: Direct password
    if (body.password === ADMIN_PASSWORD) {
      return setAdminCookie(NextResponse.json({ success: true }));
    }

    // Method 2: Check by email - verify if this email has admin role in DB
    if (body.email) {
      try {
        const serviceClient = createServiceClient();
        const { data: profile } = await serviceClient
          .from("profiles")
          .select("role")
          .eq("email", body.email.toLowerCase().trim())
          .single();

        const role = (profile as { role: string } | null)?.role;
        if (role && ["admin", "super_admin"].includes(role)) {
          return setAdminCookie(NextResponse.json({ success: true }));
        }
      } catch {
        // DB check failed, fall through
      }
    }

    return NextResponse.json(
      { success: false, error: "Mot de passe incorrect" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Requete invalide" },
      { status: 400 }
    );
  }
}

const ADMIN_EMAILS = [
  "gdrmathis15@gmail.com",
  "vanderieviere76@gmail.com",
];

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("admin_session");

  if (!cookie || cookie.value !== "authenticated") {
    return NextResponse.json({ authenticated: false });
  }

  // Verify the Supabase user is actually an admin
  try {
    // Find the Supabase auth token from cookies
    const allCookies = request.cookies.getAll();
    const authCookie = allCookies.find((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));
    const authHeader = request.headers.get("authorization");

    let token: string | null = null;

    if (authCookie) {
      // The cookie value may be base64-encoded JSON with access_token
      try {
        const parsed = JSON.parse(decodeURIComponent(authCookie.value));
        token = parsed.access_token || parsed[0]?.access_token || null;
      } catch {
        token = authCookie.value;
      }
    } else if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }

    if (!token) {
      // No auth token found - cannot verify user, invalidate admin session
      const response = NextResponse.json({ authenticated: false });
      response.cookies.set("admin_session", "", { path: "/", httpOnly: true, sameSite: "lax", maxAge: 0 });
      return response;
    }

    const serviceClient = createServiceClient();
    const { data: { user }, error } = await serviceClient.auth.getUser(token);

    if (error || !user || !user.email) {
      const response = NextResponse.json({ authenticated: false });
      response.cookies.set("admin_session", "", { path: "/", httpOnly: true, sameSite: "lax", maxAge: 0 });
      return response;
    }

    // Check if email is in the admin list
    if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return NextResponse.json({ authenticated: true });
    }

    // Check if user has admin/super_admin role in profiles table
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = (profile as { role: string } | null)?.role;
    if (role && ["admin", "super_admin"].includes(role)) {
      return NextResponse.json({ authenticated: true });
    }

    // User is not an admin - delete the cookie
    const response = NextResponse.json({ authenticated: false });
    response.cookies.set("admin_session", "", { path: "/", httpOnly: true, sameSite: "lax", maxAge: 0 });
    return response;
  } catch {
    // On error, fail closed - invalidate the session
    const response = NextResponse.json({ authenticated: false });
    response.cookies.set("admin_session", "", { path: "/", httpOnly: true, sameSite: "lax", maxAge: 0 });
    return response;
  }
}
