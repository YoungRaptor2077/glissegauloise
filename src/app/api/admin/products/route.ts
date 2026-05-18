import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

interface ProductPayload {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  categoryId: string;
  brand: string;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and admin role
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non autorise" },
        { status: 401 }
      );
    }

    const { data: profile } = await authClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const profileRole = (profile as { role: string } | null)?.role;
    if (!profileRole || profileRole !== "admin") {
      return NextResponse.json(
        { error: "Acces interdit" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as ProductPayload;

    if (!body.name || !body.slug || !body.price) {
      return NextResponse.json(
        { error: "Les champs nom, slug et prix sont obligatoires" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from("products").insert({
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      price: parseFloat(body.price),
      compare_at_price: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
      stock_quantity: body.stock ? parseInt(body.stock, 10) : 0,
      category_id: body.categoryId || null,
      images: body.images || [],
      is_featured: body.isFeatured ?? false,
      is_active: body.isActive ?? true,
    });

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
        { error: "Erreur lors de la creation du produit" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation du produit" },
      { status: 500 }
    );
  }
}
