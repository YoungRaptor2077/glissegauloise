import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

    const userEmail = data?.session?.user?.email;
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
