"use client";

import { useState } from "react";
import { useRequireAuth } from "@/lib/use-require-auth";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useRequireAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" style={{ width: "32px", height: "32px", borderColor: "rgba(108,99,255,0.2)", borderTopColor: "var(--accent-primary)" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)", position: "relative" }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile Header */}
        <header
          className="mobile-only"
          style={{
            height: "60px",
            padding: "0 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-secondary)",
            position: "sticky",
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "8px", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🎓</div>
            <span style={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }} className="gradient-text">MentorAI</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
        </header>

        <main
          className="animate-fade-in"
          style={{
            flex: 1,
            padding: "var(--container-px)",
            overflowY: "auto",
            minHeight: "calc(100vh - 60px)",
          }}
        >
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
