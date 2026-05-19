import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const adminToken = request.cookies.get("admin_token")?.value;

  if (adminToken === "glissegauloise_admin_authenticated") {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false });
}
