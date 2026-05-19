import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = "12512595";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_session", "authenticated", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 604800, // 7 days
      });
      return response;
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
