import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD || "12512595";

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("admin_token", "glissegauloise_admin_authenticated", {
      httpOnly: true,
      secure: isProduction,
      path: "/",
      maxAge: 604800,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Requete invalide" },
      { status: 400 }
    );
  }
}
