import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

function isAdminAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get("admin_session");
  return cookie?.value === "authenticated";
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { quoteId } = body;

    const supabase = createServiceClient();

    // Update status to "sent"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("quotes") as any)
      .update({ status: "sent" })
      .eq("id", quoteId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote send error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
