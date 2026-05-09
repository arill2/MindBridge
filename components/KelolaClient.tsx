"use client";

import { useState, useCallback } from "react";
import { User } from "@/types";
import { fetchApi } from "@/lib/utils";
import StudentForm from "@/components/StudentForm";
import { ScrollReveal } from "@/components/ScrollReveal";

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const HEADING = "'Newsreader', Georgia, serif";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

interface KelolaClientProps {
  initialStudents: User[];
}

export default function KelolaClient({ initialStudents }: KelolaClientProps) {
  const [students, setStudents] = useState<User[]>(initialStudents);
  const [isLoading, setIsLoading] = useState(false);
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

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await fetchApi<{ students: User[] }>("/api/students");
    if (data) setStudents(data.students);
    if (error) showToast("Gagal memuat data siswa", "error");
    setIsLoading(false);
  }, []);

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

  return (
    <>
      {/* Header */}
      <ScrollReveal animation="fade-in-up" delay={0} threshold={0}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 24, flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <h1 style={{
            fontFamily: HEADING, fontSize: "clamp(22px, 4vw, 30px)",
            fontWeight: 600, color: "#261813", margin: "0 0 6px 0",
          }}>
            Kelola Siswa
          </h1>
          <p style={{ color: "#8D7167", fontSize: 14, margin: 0 }}>
            Tambah, edit, dan kelola akun siswa MindBridge
          </p>
        </div>
        <button
          onClick={() => { setEditingStudent(undefined); setShowModal(true); }}
          style={{
            padding: "12px 24px", borderRadius: 999, background: "#FF6B2C",
            color: "#FFFFFF", fontFamily: FONT, fontSize: 14, fontWeight: 700,
            border: "none", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(255,107,44,0.35)",
            transition: "transform 0.15s",
          }}
        >
          + Tambah Siswa
        </button>
      </div>
      </ScrollReveal>

      {/* Filter Bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: 24, flexWrap: "wrap",
      }}>
        <input
          type="text"
          placeholder="Cari nama atau NIS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: "1 1 200px", padding: "12px 20px", borderRadius: 999,
            border: "1px solid #E2BFB3", background: "#FFFFFF",
            fontFamily: FONT, fontSize: 14, outline: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}
        />
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          style={{
            flex: "1 1 140px", padding: "12px 20px", borderRadius: 999, border: "1px solid #E2BFB3",
            background: "#FFFFFF", fontFamily: FONT, fontSize: 14, outline: "none",
            cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}
        >
          <option value="">Semua Kelas</option>
          {allClasses.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
        </select>
        <span style={{ fontSize: 14, color: "#8D7167", whiteSpace: "nowrap" }}>
          {filtered.length} siswa
        </span>
      </div>

      {/* ── Mobile Cards / Desktop Table ─────────────── */}
      {isLoading ? (
        <div style={{
          textAlign: "center", padding: "60px 0",
          background: "#FFFFFF", borderRadius: 24,
          border: "1px solid #FFE9E2",
        }}>
          <div style={{ fontSize: 32, animation: "pulse 2s infinite", marginBottom: 12 }}>🌤️</div>
          <p style={{ color: "#8D7167", margin: 0, fontSize: 14 }}>Memuat data siswa...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 0",
          background: "#FFFFFF", borderRadius: 24,
          border: "1px solid #FFE9E2",
        }}>
          <p style={{ color: "#8D7167", margin: 0, fontSize: 14 }}>
            {search || filterClass ? "Tidak ada siswa yang cocok dengan pencarian" : "Belum ada siswa terdaftar"}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: Card Layout */}
          <div className="kelola-mobile-cards" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((student) => (
              <div key={student.id} style={{
                background: "#FFFFFF", borderRadius: 16, padding: 16,
                border: "1px solid #FFE9E2",
                boxShadow: "0 2px 8px rgba(255,107,44,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: "#FF6B2C",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#FFF", fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>
                    {initials(student.name)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#261813", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{student.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#8D7167", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      NIS: {student.nis} · {student.class}
                    </p>
                  </div>
                </div>
                {student.email && (
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: "#594139", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    ✉️ {student.email}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                  <button
                    onClick={() => { setEditingStudent(student); setShowModal(true); }}
                    style={{
                      padding: "8px 16px", borderRadius: 999, background: "#FFF8F6",
                      border: "1px solid #FF6B2C", color: "#FF6B2C", fontSize: 12,
                      fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                    }}
                  >
                    Edit
                  </button>
                  {deleteConfirm === student.id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                      <button onClick={() => handleDelete(student.id)} style={{
                        padding: "8px 12px", borderRadius: 999, background: "#DC2626",
                        border: "none", color: "#FFF", fontSize: 12, fontWeight: 600,
                        cursor: "pointer", fontFamily: FONT,
                      }}>
                        Yakin?
                      </button>
                      <button onClick={() => setDeleteConfirm(null)} style={{
                        padding: "8px 12px", borderRadius: 999, background: "#FAFAFA",
                        border: "1px solid #E5E7EB", color: "#6B7280", fontSize: 12,
                        fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                      }}>
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(student.id)} style={{
                      padding: "8px 16px", borderRadius: 999, background: "#FFF0EE",
                      border: "1px solid #FCA5A5", color: "#DC2626", fontSize: 12,
                      fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                    }}>
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table Layout */}
          <div className="kelola-desktop-table" style={{
            background: "#FFFFFF", borderRadius: 24, overflow: "hidden",
            boxShadow: "0 4px 24px rgba(255,107,44,0.08)", border: "1px solid #FFE9E2",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #FFE9E2", background: "#FFF8F6" }}>
                  {["No", "Nama", "NIS", "Kelas", "Email", "Aksi"].map((h) => (
                    <th key={h} style={{
                      padding: "16px 20px", fontSize: 12, fontWeight: 700,
                      color: "#A89288", textTransform: "uppercase", letterSpacing: 0.5,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, idx) => (
                  <tr key={student.id} style={{ borderBottom: "1px solid #FFF8F6", transition: "background 0.15s" }}>
                    <td style={{ padding: "16px 20px", fontSize: 14, color: "#8D7167" }}>{idx + 1}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%", background: "#FF6B2C",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#FFF", fontSize: 12, fontWeight: 700,
                        }}>
                          {initials(student.name)}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#261813" }}>{student.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: 14, color: "#594139" }}>{student.nis}</td>
                    <td style={{ padding: "16px 20px", fontSize: 14, color: "#594139" }}>{student.class}</td>
                    <td style={{ padding: "16px 20px", fontSize: 14, color: "#594139" }}>{student.email || "—"}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                          onClick={() => { setEditingStudent(student); setShowModal(true); }}
                          style={{
                            padding: "6px 14px", borderRadius: 999, background: "#FFF8F6",
                            border: "1px solid #FF6B2C", color: "#FF6B2C", fontSize: 12,
                            fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                          }}
                        >
                          Edit
                        </button>
                        {deleteConfirm === student.id ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <button onClick={() => handleDelete(student.id)} style={{
                              padding: "6px 10px", borderRadius: 999, background: "#DC2626",
                              border: "none", color: "#FFF", fontSize: 12, fontWeight: 600,
                              cursor: "pointer", fontFamily: FONT,
                            }}>
                              Yakin?
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} style={{
                              padding: "6px 10px", borderRadius: 999, background: "#FAFAFA",
                              border: "1px solid #E5E7EB", color: "#6B7280", fontSize: 12,
                              fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                            }}>
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(student.id)} style={{
                            padding: "6px 14px", borderRadius: 999, background: "#FFF0EE",
                            border: "1px solid #FCA5A5", color: "#DC2626", fontSize: 12,
                            fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                          }}>
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(38,24,19,0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 60, padding: 20,
        }}>
          <div style={{
            background: "#FFFFFF", borderRadius: 28, padding: "24px",
            width: "100%", maxWidth: 480,
            boxShadow: "0 24px 80px rgba(255,107,44,0.2)",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <h2 style={{ fontFamily: HEADING, fontSize: 22, fontWeight: 600, color: "#261813", margin: "0 0 20px 0" }}>
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
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: toast.type === "success" ? "#22C55E" : "#DC2626",
          color: "#FFFFFF", padding: "12px 24px", borderRadius: 16,
          fontSize: 14, fontWeight: 600, fontFamily: FONT,
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)", zIndex: 100,
          whiteSpace: "nowrap",
        }}>
          {toast.msg}
        </div>
      )}
    </>
  );
}
