import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "guru") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await req.json();

    // Strict trim validation — reject whitespace-only strings
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Nama dan Email harus diisi" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("users")
      .update({ name: name.trim(), email: email.trim() })
      .eq("id", session.user.id)
      .eq("role", "guru")   // extra guard: cannot update non-guru rows
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Profil berhasil diperbarui",
      user: { name: data.name, email: data.email }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}

