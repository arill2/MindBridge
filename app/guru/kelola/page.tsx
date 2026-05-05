"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StudentForm from "@/components/StudentForm";
import { User } from "@/types";
import { fetchApi } from "@/lib/utils";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const HEADING = "'Newsreader', Georgia, serif";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function KelolaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user.role !== "guru") router.push("/login");
  }, [status, session, router]);

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await fetchApi<{ students: User[] }>("/api/students");
    if (data) setStudents(data.students);
    if (error) showToast("Gagal memuat data siswa", "error");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadStudents();
  }, [status, loadStudents]);

  const filtered = students.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.nis || "").includes(search);
    const matchClass = !filterClass || s.class === filterClass;
    return matchSearch && matchClass;
  });

  const allClasses = [...new Set(students.map((s) => s.class).filter(Boolean))].sort();

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    if (editingStudent) {
      const { error } = await fetchApi("/api/students", {
        method: "PUT",
        body: JSON.stringify({ id: editingStudent.id, ...formData }),
      });
      if (error) showToast(error, "error");
      else { showToast("Data siswa diperbarui ✅", "success"); setShowModal(false); loadStudents(); }
    } else {
      const { error } = await fetchApi("/api/students", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (error) showToast(error, "error");
      else { showToast("Siswa ditambahkan ✅", "success"); setShowModal(false); loadStudents(); }
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await fetchApi(`/api/students?id=${id}`, { method: "DELETE" });
    if (error) showToast(error, "error");
    else { showToast("Siswa dihapus", "success"); loadStudents(); }
    setDeleteConfirm(null);
  };

  const guruName = session?.user?.name || "Guru BK";
  const displayName = guruName.split(" ").slice(0, 2).join(" ");

  if (status === "loading") {
    return <div style={{ minHeight: "100vh", background: "#FFF8F6" }} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFF8F6", fontFamily: FONT }}>
      {/* ── SIDEBAR ────────────────────────────────────── */}
      <aside style={{
        width: "240px", flexShrink: 0, background: "#FFFFFF",
        borderRight: "1px solid #FFE9E2", display: "flex", flexDirection: "column",
        boxShadow: "2px 0 16px rgba(255,107,44,0.06)", zIndex: 10,
      }}>
        <div style={{ padding: "24px", borderBottom: "1px solid #FFE9E2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "26px" }}>🌉</span>
            <span style={{ fontFamily: HEADING, fontSize: "20px", fontWeight: 600, color: "#261813" }}>MindBridge</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {[
            { href: "/guru/dashboard", icon: "📊", label: "Dashboard", active: false },
            { href: "/guru/kelola", icon: "👥", label: "Kelola Siswa", active: true },
            { href: "/guru/laporan", icon: "📋", label: "Laporan", active: false },
            { href: "/guru/pengaturan", icon: "⚙️", label: "Pengaturan", active: false },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
              borderRadius: "999px", textDecoration: "none", fontSize: "14px", fontWeight: 600,
              background: item.active ? "#FF6B2C" : "transparent",
              color: item.active ? "#FFFFFF" : "#594139",
              boxShadow: item.active ? "0 4px 14px rgba(255,107,44,0.28)" : "none",
              transition: "all 0.15s",
            }}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid #FFE9E2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "50%", background: "#FF6B2C",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#FFF", fontSize: "13px", fontWeight: 700, flexShrink: 0,
            }}>
              {initials(guruName)}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#261813", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {displayName}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#8D7167" }}>Guru BK</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ── MAIN ───────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto", maxWidth: "calc(100vw - 240px)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontFamily: HEADING, fontSize: "28px", fontWeight: 600, color: "#261813", margin: "0 0 4px 0" }}>
              Kelola Siswa
            </h1>
            <p style={{ color: "#8D7167", fontSize: "14px", margin: 0 }}>Tambah, edit, dan kelola akun siswa MindBridge</p>
          </div>
          <button
            onClick={() => { setEditingStudent(undefined); setShowModal(true); }}
            style={{
              padding: "12px 24px", borderRadius: "999px", background: "#FF6B2C", color: "#FFFFFF",
              fontFamily: FONT, fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer",
              boxShadow: "0 4px 16px rgba(255,107,44,0.35)", transition: "transform 0.15s",
            }}
          >
            + Tambah Siswa
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="Cari nama atau NIS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, padding: "12px 20px", borderRadius: "999px", border: "1px solid #E2BFB3",
              background: "#FFFFFF", fontFamily: FONT, fontSize: "14px", outline: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            style={{
              padding: "12px 20px", borderRadius: "999px", border: "1px solid #E2BFB3",
              background: "#FFFFFF", fontFamily: FONT, fontSize: "14px", outline: "none",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <option value="">Semua Kelas</option>
            {allClasses.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
          </select>
          <span style={{ fontSize: "14px", color: "#8D7167", whiteSpace: "nowrap" }}>
            {filtered.length} siswa
          </span>
        </div>

        {/* Table Container */}
        <div style={{
          background: "#FFFFFF", borderRadius: "24px", overflow: "hidden",
          boxShadow: "0 4px 24px rgba(255,107,44,0.08)", border: "1px solid #FFE9E2",
        }}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "32px", animation: "pulse 2s infinite", marginBottom: "12px" }}>🌤️</div>
              <p style={{ color: "#8D7167", margin: 0, fontSize: "14px" }}>Memuat data siswa...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "#8D7167", margin: 0, fontSize: "14px" }}>
                {search || filterClass ? "Tidak ada siswa yang cocok dengan pencarian" : "Belum ada siswa terdaftar"}
              </p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #FFE9E2", background: "#FFF8F6" }}>
                  {["No", "Nama", "NIS", "Kelas", "Email", "Aksi"].map((h) => (
                    <th key={h} style={{ padding: "16px 20px", fontSize: "12px", fontWeight: 700, color: "#A89288", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, idx) => (
                  <tr key={student.id} style={{ borderBottom: "1px solid #FFF8F6", transition: "background 0.15s" }}>
                    <td style={{ padding: "16px 20px", fontSize: "14px", color: "#8D7167" }}>{idx + 1}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FF6B2C", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: "12px", fontWeight: 700 }}>
                          {initials(student.name)}
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#261813" }}>{student.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: "14px", color: "#594139" }}>{student.nis}</td>
                    <td style={{ padding: "16px 20px", fontSize: "14px", color: "#594139" }}>{student.class}</td>
                    <td style={{ padding: "16px 20px", fontSize: "14px", color: "#594139" }}>{student.email || "—"}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          onClick={() => { setEditingStudent(student); setShowModal(true); }}
                          style={{
                            padding: "6px 14px", borderRadius: "999px", background: "#FFF8F6", border: "1px solid #FF6B2C",
                            color: "#FF6B2C", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                          }}
                        >
                          Edit
                        </button>
                        {deleteConfirm === student.id ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <button onClick={() => handleDelete(student.id)} style={{ padding: "6px 10px", borderRadius: "999px", background: "#DC2626", border: "none", color: "#FFF", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
                              Yakin?
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} style={{ padding: "6px 10px", borderRadius: "999px", background: "#FAFAFA", border: "1px solid #E5E7EB", color: "#6B7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(student.id)} style={{ padding: "6px 14px", borderRadius: "999px", background: "#FFF0EE", border: "1px solid #FCA5A5", color: "#DC2626", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(38,24,19,0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, padding: "20px",
        }}>
          <div style={{
            background: "#FFFFFF", borderRadius: "28px", padding: "32px",
            width: "100%", maxWidth: "480px",
            boxShadow: "0 24px 80px rgba(255,107,44,0.2)",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <h2 style={{ fontFamily: HEADING, fontSize: "24px", fontWeight: 600, color: "#261813", margin: "0 0 24px 0" }}>
              {editingStudent ? "Edit Data Siswa" : "Tambah Siswa Baru"}
            </h2>
            <StudentForm
              student={editingStudent}
              onSubmit={handleSubmit}
              onCancel={() => setShowModal(false)}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "32px", right: "32px",
          background: toast.type === "success" ? "#22C55E" : "#DC2626",
          color: "#FFFFFF", padding: "14px 24px", borderRadius: "16px",
          fontSize: "14px", fontWeight: 600, fontFamily: FONT,
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)", zIndex: 100,
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.1)} }
        tr:hover { background: #FFF8F6 !important; }
      `}</style>
    </div>
  );
}
