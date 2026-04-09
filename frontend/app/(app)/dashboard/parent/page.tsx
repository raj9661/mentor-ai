"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { inviteApi, profileApi, ParentProfile } from "@/lib/api";

interface ChildLink {
  student_id: string;
  name: string;
  email: string;
}

export default function ParentDashboard() {
  const [profile, setProfile] = useState<Partial<ParentProfile>>({});
  const [children, setChildren] = useState<ChildLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, childrenData] = await Promise.all([
          profileApi.getParent().catch(() => ({})),
          inviteApi.children().catch(() => []),
        ]);
        setProfile(profData);
        setChildren(childrenData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div className="skeleton" style={{ width: "100%", height: "200px" }} />
        <div className="skeleton" style={{ width: "calc(50% - 10px)", height: "300px" }} />
        <div className="skeleton" style={{ width: "calc(50% - 10px)", height: "300px" }} />
      </div>
    );
  }

  const hasChildren = children.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
          Welcome, Parent 👋
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Monitor and support your child's career journey.</p>
      </div>

      {!hasChildren && (
        <div
          className="card"
          style={{
            padding: "24px",
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "24px" }}>🔗</div>
            <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Link your child's account</h2>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1.6 }}>
            You haven't linked any student accounts yet. Link an account to view their AI recommendations, progress, and profile.
          </p>
          <div>
            <Link href="/dashboard/parent/invite" className="btn btn-primary" style={{ padding: "10px 24px" }}>
              Link Child Account →
            </Link>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        
        {/* Linked Children Snapshot */}
        <div className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🎓</span> Linked Students
          </h2>
          {hasChildren ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {children.map((child, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", border: "1px solid var(--border)", padding: "12px", borderRadius: "10px" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "white" }}>
                    {child.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{child.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{child.email}</div>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <Link href="/dashboard/parent/child" className="btn btn-secondary" style={{ flex: 1 }}>View Profile</Link>
                <Link href="/dashboard/parent/recommendations" className="btn btn-secondary" style={{ flex: 1 }}>View Paths</Link>
              </div>
            </div>
          ) : (
             <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No students linked yet.</p>
          )}
        </div>

        {/* Parent Config Snapshot */}
        <div className="card" style={{ padding: "24px" }}>
           <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>⚙️</span> Your Settings
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
             <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
               Setting your expectations and budget constraints helps the AI give realistic advice to your child.
             </p>
             <div style={{ margin: "8px 0" }}>
               {profile.budget ? (
                 <div className="badge badge-green">Budget: {profile.budget}</div>
               ) : (
                 <div className="badge badge-orange">Budget: Not Set</div>
               )}
             </div>
             <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
               Expectations set: {profile.expectations ? "✅ Yes" : "❌ No"}
             </p>
             <Link href="/dashboard/parent/profile" style={{ color: "var(--accent-secondary)", fontSize: "14px", marginTop: "auto", textDecoration: "none", fontWeight: 500, paddingTop: "8px" }}>
                Update Preferences →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
