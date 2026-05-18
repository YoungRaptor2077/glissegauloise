import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

interface CategoryPayload {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  sort_order?: number;
}

async function verifyAdmin() {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return null;

  const serviceClient = createServiceClient();
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profileRole = (profile as { role: string } | null)?.role;
  if (!profileRole || !["admin", "super_admin"].includes(profileRole)) return null;
  return user;
}

export async function GET() {
  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json(
        { error: "Erreur lors de la recuperation des categories" },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories: data || [] });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = (await request.json()) as CategoryPayload;

    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: "Les champs nom et slug sont obligatoires" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        parent_id: body.parent_id || null,
        sort_order: body.sort_order ?? 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      return NextResponse.json(
        { error: "Erreur lors de la creation de la categorie" },
        { status: 500 }
      );
    }

    return NextResponse.json({ category: data });
  } catch (error) {
    console.error("Category creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la categorie" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = (await request.json()) as CategoryPayload;

    if (!body.id) {
      return NextResponse.json(
        { error: "L'identifiant de la categorie est requis" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("categories")
      .update({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        parent_id: body.parent_id || null,
        sort_order: body.sort_order ?? 0,
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      return NextResponse.json(
        { error: "Erreur lors de la mise a jour de la categorie" },
        { status: 500 }
      );
    }

    return NextResponse.json({ category: data });
  } catch (error) {
    console.error("Category update error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour de la categorie" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "L'identifiant de la categorie est requis" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      return NextResponse.json(
        { error: "Erreur lors de la suppression de la categorie" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Category deletion error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la categorie" },
      { status: 500 }
    );
  }
}
