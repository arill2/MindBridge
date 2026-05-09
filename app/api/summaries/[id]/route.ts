import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "guru") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID ringkasan diperlukan" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("summaries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting summary:", error);
      return NextResponse.json({ error: "Gagal menghapus ringkasan" }, { status: 500 });
    }

    return NextResponse.json({ message: "Ringkasan berhasil dihapus" });
  } catch (error) {
    console.error("Summaries DELETE API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem" },
      { status: 500 }
    );
  }
}
