import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  try {
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("quotes") as any)
      .select("id, status, total, payment_url, valid_until, created_at, line_items, labor_cost, notes")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ quotes: data || [] });
  } catch (error) {
    console.error("Client quotes error:", error);
    return NextResponse.json({ quotes: [] });
  }
}
