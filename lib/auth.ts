import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByNis, getUserByEmail } from "@/lib/supabase";
import { UserRole } from "@/types";

// ============================================================
// NextAuth Configuration
// ============================================================
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 jam (1 hari sekolah)
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    // --------------------------------------------------------
    // Siswa: Login dengan NIS + password
    // --------------------------------------------------------
    CredentialsProvider({
      id: "siswa-credentials",
      name: "Siswa",
      credentials: {
        nis: { label: "NIS", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.nis || !credentials?.password) {
          throw new Error("NIS dan password harus diisi");
        }

        const user = await getUserByNis(credentials.nis);
        if (!user) {
          throw new Error("NIS atau password salah");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );
        if (!isValidPassword) {
          throw new Error("NIS atau password salah");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email || `${user.nis}@mindbridge.app`,
          role: user.role,
          nis: user.nis,
          class: user.class,
        };
      },
    }),

    // --------------------------------------------------------
    // Guru BK: Login dengan email + password
    // --------------------------------------------------------
    CredentialsProvider({
      id: "guru-credentials",
      name: "Guru BK",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi");
        }

        const user = await getUserByEmail(credentials.email);
        if (!user) {
          throw new Error("Email atau password salah");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );
        if (!isValidPassword) {
          throw new Error("Email atau password salah");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: UserRole }).role;
        token.nis = (user as { nis?: string }).nis;
        token.class = (user as { class?: string }).class;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.nis = token.nis as string | undefined;
        session.user.class = token.class as string | undefined;
      }
      return session;
    },
  },
};

// ============================================================
// NextAuth Type Extensions
// ============================================================
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      nis?: string;
      class?: string;
    };
  }

  interface User {
    id: string;
    role: UserRole;
    nis?: string;
    class?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    nis?: string;
    class?: string;
  }
}
