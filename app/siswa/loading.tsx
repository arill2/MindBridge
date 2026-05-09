import { Skeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", background: "#FFF8F6", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "800px", marginTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <Skeleton width="150px" height="32px" borderRadius="12px" />
          <Skeleton width="48px" height="48px" borderRadius="50%" />
        </div>
        
        <div style={{ background: "#FFFFFF", borderRadius: "24px", padding: "32px", border: "1px solid #FFE9E2", marginBottom: "24px" }}>
          <Skeleton width="100px" height="100px" borderRadius="50%" style={{ margin: "0 auto 24px" }} />
          <Skeleton width="200px" height="28px" borderRadius="12px" style={{ margin: "0 auto 16px" }} />
          <Skeleton width="80%" height="16px" borderRadius="8px" style={{ margin: "0 auto 32px" }} />
          <Skeleton width="180px" height="48px" borderRadius="999px" style={{ margin: "0 auto" }} />
        </div>
      </div>
    </div>
  );
}
