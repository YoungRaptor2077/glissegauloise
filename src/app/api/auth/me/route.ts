import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ role: null, authenticated: false });
    }

    // Use untyped client with service role to bypass RLS
    const serviceClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile, error } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ role: "client", authenticated: true });
    }

    return NextResponse.json({
      role: profile.role,
      authenticated: true,
    });
  } catch {
    return NextResponse.json({ role: null, authenticated: false });
  }
}
