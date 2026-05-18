import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

interface TarifPayload {
  id?: string;
  title: string;
  price_range: string;
  description: string;
  features: string[];
  icon_name: string;
  highlighted: boolean;
  sort_order: number;
  is_active: boolean;
}

async function verifyAdmin() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) return null;

  const { data: profile } = await authClient
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
      .from("tarifs")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching tarifs:", error);
      return NextResponse.json(
        { error: "Erreur lors de la recuperation des tarifs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ tarifs: data || [] });
  } catch (error) {
    console.error("Tarifs fetch error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des tarifs" },
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

    const body = (await request.json()) as TarifPayload;

    if (!body.title || !body.price_range) {
      return NextResponse.json(
        { error: "Le titre et la fourchette de prix sont obligatoires" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("tarifs")
      .insert({
        title: body.title,
        price_range: body.price_range,
        description: body.description || "",
        features: body.features || [],
        icon_name: body.icon_name || "Settings",
        highlighted: body.highlighted ?? false,
        sort_order: body.sort_order ?? 0,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating tarif:", error);
      return NextResponse.json(
        { error: "Erreur lors de la creation du tarif" },
        { status: 500 }
      );
    }

    return NextResponse.json({ tarif: data });
  } catch (error) {
    console.error("Tarif creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation du tarif" },
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

    const body = (await request.json()) as TarifPayload;

    if (!body.id) {
      return NextResponse.json(
        { error: "L'identifiant du tarif est requis" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("tarifs")
      .update({
        title: body.title,
        price_range: body.price_range,
        description: body.description || "",
        features: body.features || [],
        icon_name: body.icon_name || "Settings",
        highlighted: body.highlighted ?? false,
        sort_order: body.sort_order ?? 0,
        is_active: body.is_active ?? true,
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating tarif:", error);
      return NextResponse.json(
        { error: "Erreur lors de la mise a jour du tarif" },
        { status: 500 }
      );
    }

    return NextResponse.json({ tarif: data });
  } catch (error) {
    console.error("Tarif update error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour du tarif" },
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
        { error: "L'identifiant du tarif est requis" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from("tarifs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting tarif:", error);
      return NextResponse.json(
        { error: "Erreur lors de la suppression du tarif" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tarif deletion error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du tarif" },
      { status: 500 }
    );
  }
}
