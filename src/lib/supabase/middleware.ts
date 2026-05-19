import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedPaths = ["/espace-client", "/admin", "/api/admin"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !user) {
    // For API routes, return 401 JSON response instead of redirect
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Non autorise" },
        { status: 401 }
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Admin role check: redirect non-admin users away from /admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/api/admin");
  if (isAdminRoute && user) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      // No service role key - allow access, API routes have their own checks
      return supabaseResponse;
    }

    const { createClient } = await import("@supabase/supabase-js");
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );
    const { data: profile, error: profileError } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      // Cannot verify role - allow access, API routes have their own checks
      console.error("Middleware profile fetch error:", profileError);
      return supabaseResponse;
    }

    const role = (profile as { role: string } | null)?.role;
    if (!role || !["admin", "super_admin"].includes(role)) {
      if (request.nextUrl.pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { error: "Acces interdit" },
          { status: 403 }
        );
      }
      const url = request.nextUrl.clone();
      url.pathname = "/espace-client";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
