import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

const ADMIN_EMAILS = ["gdrmathis15@gmail.com", "vanderieviere76@gmail.com"];

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect") || "/espace-client";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // The `set` method was called from a Server Component.
            }
          },
        },
      }
    );

    const { data } = await supabase.auth.exchangeCodeForSession(code);

    const user = data?.session?.user;
    const userEmail = user?.email;

    // Send welcome email for new users (created within last 60 seconds)
    if (user) {
      const createdAt = new Date(user.created_at);
      const now = new Date();
      if (now.getTime() - createdAt.getTime() < 60000) {
        sendWelcomeEmail(user.email || "", user.user_metadata?.full_name || "");
      }
    }

    if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
      const response = NextResponse.redirect(new URL("/admin", requestUrl.origin));
      response.cookies.set("admin_session", "authenticated", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 604800,
      });
      return response;
    }
  }

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}
