import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAdminClient, getAllStudents } from "@/lib/supabase";
import { StudentCreateRequest, StudentUpdateRequest } from "@/types";
import bcrypt from "bcryptjs";

// ============================================================
// GET — Ambil semua siswa (Guru only)
// ============================================================
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "guru") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const students = await getAllStudents();
    return NextResponse.json({ students });
  } catch (error) {
    console.error("GET students error:", error);
    return NextResponse.json({ error: "Gagal memuat data siswa" }, { status: 500 });
  }
}

// ============================================================
// POST — Tambah siswa baru (Guru only)
// ============================================================
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: StudentCreateRequest = await req.json();
    const { name, nis, class: studentClass, email, password } = body;

    // Validasi
    if (!name?.trim() || !nis?.trim() || !studentClass?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Nama, NIS, kelas, dan password harus diisi" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Simpan ke database menggunakan admin client
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("users")
      .insert({
        name: name.trim(),
        nis: nis.trim(),
        role: "siswa",
        class: studentClass.trim(),
        email: email?.trim() || null,
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "NIS sudah terdaftar" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ student: data }, { status: 201 });
  } catch (error) {
    console.error("Create student error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan siswa" },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT — Update siswa (Guru only)
// ============================================================
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: StudentUpdateRequest = await req.json();
    const { id, password, name, nis, class: studentClass, email } = body;

    if (!id) {
      return NextResponse.json({ error: "ID siswa diperlukan" }, { status: 400 });
    }

    const updatePayload: Record<string, unknown> = {};

    // Hanya update field yang diizinkan (mencegah mass-assignment)
    if (name !== undefined) updatePayload.name = name.trim();
    if (nis !== undefined) updatePayload.nis = nis.trim();
    if (studentClass !== undefined) updatePayload.class = studentClass.trim();
    if (email !== undefined) updatePayload.email = email === "" ? null : email.trim();

    // Hash password baru jika ada
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password minimal 6 karakter" },
          { status: 400 }
        );
      }
      updatePayload.password_hash = await bcrypt.hash(password, 12);
    }

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("users")
      .update(updatePayload)
      .eq("id", id)
      .eq("role", "siswa")
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ student: data });
  } catch (error) {
    console.error("Update student error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data siswa" },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE — Hapus siswa (Guru only)
// ============================================================
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID siswa diperlukan" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("users")
      .delete()
      .eq("id", id)
      .eq("role", "siswa");

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus siswa" },
      { status: 500 }
    );
  }
}
