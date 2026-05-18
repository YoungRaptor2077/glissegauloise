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
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
}

async function verifyAdmin() {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Non autorise" }, { status: 401 }) };
  }

  const { data: profile } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profileRole = (profile as { role: string } | null)?.role;
  if (!profileRole || profileRole !== "admin") {
    return { error: NextResponse.json({ error: "Acces interdit" }, { status: 403 }) };
  }

  return { user };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await verifyAdmin();
    if ("error" in result && result.error) return result.error;

    const body = (await request.json()) as ProductPayload;

    if (!body.name || !body.slug || !body.price) {
      return NextResponse.json(
        { error: "Les champs nom, slug et prix sont obligatoires" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { error } = await supabase
      .from("products")
      .update({
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
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
        { error: "Erreur lors de la mise a jour du produit" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour du produit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await verifyAdmin();
    if ("error" in result && result.error) return result.error;

    const supabase = createServiceClient();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { error: "Erreur lors de la suppression du produit" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product deletion error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du produit" },
      { status: 500 }
    );
  }
}
