"use client";

import { useRequireAuth } from "@/lib/use-require-auth";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" style={{ width: "32px", height: "32px", borderColor: "rgba(108,99,255,0.2)", borderTopColor: "var(--accent-primary)" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main
        className="animate-fade-in"
        style={{
          flex: 1,
          padding: "32px 40px",
          overflowY: "auto",
          height: "100vh",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
