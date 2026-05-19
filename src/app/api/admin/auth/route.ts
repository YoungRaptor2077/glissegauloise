import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

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

    // Method 2: Check if current Supabase user is admin
    if (body.checkRole === true) {
      try {
        const authClient = await createClient();
        const { data: { user } } = await authClient.auth.getUser();

        if (user) {
          const serviceClient = createServiceClient();
          const { data: profile } = await serviceClient
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          const role = (profile as { role: string } | null)?.role;
          if (role && ["admin", "super_admin"].includes(role)) {
            return setAdminCookie(NextResponse.json({ success: true }));
          }
        }
      } catch {
        // Supabase check failed, fall through
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
