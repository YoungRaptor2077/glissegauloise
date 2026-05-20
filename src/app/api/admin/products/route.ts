import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  try {
    // Check admin cookie
    const cookie = request.cookies.get("admin_session");
    if (!cookie || cookie.value !== "authenticated") {
      return NextResponse.json(
        { error: "Non autorise - session admin manquante" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: "Le nom et le prix sont obligatoires" },
        { status: 400 }
      );
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const supabase = createServiceClient();

    const { error: insertError } = await supabase
      .from("products")
      .insert({
        name: body.name,
        slug: slug,
        description: body.description || null,
        price: parseFloat(body.price),
        compare_at_price: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
        stock: body.stock ? parseInt(body.stock, 10) : 0,
        category_id: body.categoryId || null,
        brand: body.brand || null,
        images: body.images || [],
        is_featured: body.isFeatured ?? false,
        is_active: body.isActive ?? true,
      });

    if (insertError) {
      console.error("PRODUCT INSERT ERROR:", JSON.stringify(insertError));
      return NextResponse.json(
        { error: "Erreur base de donnees: " + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "inconnue";
    console.error("PRODUCT ROUTE ERROR:", message);
    return NextResponse.json(
      { error: "Erreur serveur: " + message },
      { status: 500 }
    );
  }
}
