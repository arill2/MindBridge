"use client";

import { useState } from "react";
import { User } from "@/types";
import { isValidNIS, isValidEmail, isValidPassword } from "@/lib/utils";

interface StudentFormProps {
  student?: User;
  onSubmit: (data: {
    name: string;
    nis: string;
    class: string;
    email?: string;
    password?: string;
  }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CLASS_OPTIONS = [
  "X IPA 1", "X IPA 2", "X IPA 3",
  "X IPS 1", "X IPS 2",
  "XI IPA 1", "XI IPA 2", "XI IPA 3",
  "XI IPS 1", "XI IPS 2",
  "XII IPA 1", "XII IPA 2", "XII IPA 3",
  "XII IPS 1", "XII IPS 2",
];

const FONT = "'Be Vietnam Pro', system-ui, sans-serif";

export default function StudentForm({
  student,
  onSubmit,
  onCancel,
  isLoading = false,
}: StudentFormProps) {
  const isEdit = !!student;

  const [formData, setFormData] = useState({
    name: student?.name || "",
    nis: student?.nis || "",
    class: student?.class || "",
    email: student?.email || "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const pwd = Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    setFormData((prev) => ({ ...prev, password: pwd }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nama harus diisi";
    if (!formData.nis.trim()) {
      newErrors.nis = "NIS harus diisi";
    } else if (!isValidNIS(formData.nis)) {
      newErrors.nis = "NIS harus berupa angka (5-15 digit)";
    }
    if (!formData.class) newErrors.class = "Kelas harus dipilih";
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!isEdit && !formData.password) {
      newErrors.password = "Password harus diisi";
    }
    if (formData.password && !isValidPassword(formData.password)) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: formData.name.trim(),
      nis: formData.nis.trim(),
      class: formData.class,
      email: formData.email.trim() || undefined,
      password: formData.password || undefined,
    });
  };

  const labelStyle = { display: "block", fontSize: "13px", fontWeight: 600, color: "#261813", marginBottom: "6px", fontFamily: FONT };
  const inputStyle = (hasError: boolean) => ({
    width: "100%", padding: "12px 16px", borderRadius: "12px",
    border: `1.5px solid ${hasError ? "#FCA5A5" : "#E2BFB3"}`,
    background: hasError ? "#FEF2F2" : "#FFFFFF",
    fontFamily: FONT, fontSize: "14px", color: "#261813",
    outline: "none", boxSizing: "border-box" as const,
    transition: "all 0.2s"
  });
  const errorStyle = { margin: "4px 0 0 0", fontSize: "12px", color: "#DC2626", fontFamily: FONT };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }} noValidate>
      {/* Nama Lengkap */}
      <div>
        <label style={labelStyle}>Nama Lengkap <span style={{ color: "#FF6B2C" }}>*</span></label>
        <input
          type="text"
          placeholder="Contoh: Andi Pratama"
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          disabled={isLoading}
          style={inputStyle(!!errors.name)}
        />
        {errors.name && <p style={errorStyle}>{errors.name}</p>}
      </div>

      {/* NIS */}
      <div>
        <label style={labelStyle}>NIS <span style={{ color: "#FF6B2C" }}>*</span></label>
        <input
          type="text"
          placeholder="Contoh: 2024001"
          value={formData.nis}
          onChange={(e) => setFormData((p) => ({ ...p, nis: e.target.value }))}
          disabled={isLoading || isEdit}
          style={inputStyle(!!errors.nis)}
        />
        {errors.nis && <p style={errorStyle}>{errors.nis}</p>}
      </div>

      {/* Kelas & Email Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Kelas <span style={{ color: "#FF6B2C" }}>*</span></label>
          <select
            value={formData.class}
            onChange={(e) => setFormData((p) => ({ ...p, class: e.target.value }))}
            disabled={isLoading}
            style={{ ...inputStyle(!!errors.class), cursor: "pointer" }}
          >
            <option value="">Pilih...</option>
            {CLASS_OPTIONS.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
          </select>
          {errors.class && <p style={errorStyle}>{errors.class}</p>}
        </div>

        <div>
          <label style={labelStyle}>Email <span style={{ color: "#C4A99A", fontWeight: 400 }}>(opsional)</span></label>
          <input
            type="email"
            placeholder="siswa@sekolah.id"
            value={formData.email}
            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            disabled={isLoading}
            style={inputStyle(!!errors.email)}
          />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}
        </div>
      </div>

      {/* Password */}
      <div>
        <label style={labelStyle}>
          Password {!isEdit && <span style={{ color: "#FF6B2C" }}>*</span>}
          {isEdit && <span style={{ color: "#C4A99A", fontWeight: 400, marginLeft: "4px" }}>(kosongkan jika tidak diganti)</span>}
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Min. 6 karakter"
            value={formData.password}
            onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
            disabled={isLoading}
            style={{ ...inputStyle(!!errors.password), flex: 1 }}
          />
          <button
            type="button"
            onClick={generatePassword}
            disabled={isLoading}
            style={{
              padding: "0 16px", borderRadius: "12px", background: "#FFF8F6",
              border: "1.5px solid #FF6B2C", color: "#FF6B2C", fontSize: "13px",
              fontWeight: 700, fontFamily: FONT, cursor: "pointer", flexShrink: 0,
            }}
          >
            🔀 Generate
          </button>
        </div>
        {errors.password && <p style={errorStyle}>{errors.password}</p>}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          style={{
            flex: 1, padding: "14px", borderRadius: "999px", background: "#FAFAFA",
            border: "1px solid #E5E7EB", color: "#4B5563", fontSize: "14px",
            fontWeight: 600, fontFamily: FONT, cursor: "pointer",
          }}
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            flex: 1, padding: "14px", borderRadius: "999px", background: "#FF6B2C",
            border: "none", color: "#FFFFFF", fontSize: "14px",
            fontWeight: 600, fontFamily: FONT, cursor: isLoading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 16px rgba(255,107,44,0.35)", opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Siswa"}
        </button>
      </div>
    </form>
  );
}
