import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

const ADMIN_PASSWORD = "12512595";

function setAdminCookie(response: NextResponse) {
  response.cookies.set("admin_session", "authenticated", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 604800, // 7 days
  });
  return response;
}

export async function POST(request: NextRequest) {
  try {
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

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("admin_session");

  if (cookie && cookie.value === "authenticated") {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false });
}
