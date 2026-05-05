import { redirect } from "next/navigation";

/**
 * Root page — redirect ke /login
 * Next.js App Router: ini adalah server component
 */
export default function RootPage() {
  redirect("/login");
}
