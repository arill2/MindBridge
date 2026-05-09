import { GuruDashboardSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFF8F6" }}>
      {/* Mobile-ish Sidebar Placeholder */}
      <div className="hidden md:flex" style={{ width: "240px", background: "#FFFFFF", borderRight: "1px solid #FFE9E2", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <GuruDashboardSkeleton />
      </div>
    </div>
  );
}
