"use client";

import { useEffect, useState } from "react";
import { recommendationsApi, inviteApi, CareerRecommendation } from "@/lib/api";
import Link from "next/link";

interface ChildLink {
  student_id: string;
  name: string;
  email: string;
}

export default function ParentRecommendationsPage() {
  const [children, setChildren] = useState<ChildLink[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [recs, setRecs] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const childrenData = await inviteApi.children();
        setChildren(childrenData);
        if (childrenData.length > 0) {
          setActiveChildId(childrenData[0].student_id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (activeChildId) {
      loadRecs(activeChildId);
    }
  }, [activeChildId]);

  async function loadRecs(id: string) {
    try {
      setLoading(true);
      const data = await recommendationsApi.getForChild(id);
      setRecs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading && children.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <div className="spinner" style={{ width: "32px", height: "32px", borderColor: "rgba(108,99,255,0.2)", borderTopColor: "var(--accent-primary)" }} />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔗</div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>
          No Child Accounts Linked
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px", maxWidth: "400px", margin: "0 auto" }}>
          Link your child's account to view the AI-generated career paths designed specifically for them.
        </p>
        <Link href="/dashboard/parent/invite" className="btn btn-primary" style={{ padding: "12px 24px" }}>
          Link Account Now
        </Link>
      </div>
    );
  }

  const activeChild = children.find(c => c.student_id === activeChildId);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
          Suggested Career Paths 🎯
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          View the careers MentorAI has recommended for your child based on their profile and your constraints.
        </p>
      </div>

      {children.length > 1 && (
        <div style={{ marginBottom: "32px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
           {children.map(c => (
              <button
                key={c.student_id}
                onClick={() => setActiveChildId(c.student_id)}
                className="btn"
                style={{
                   background: activeChildId === c.student_id ? "var(--gradient-brand)" : "var(--bg-secondary)",
                   color: activeChildId === c.student_id ? "white" : "var(--text-secondary)",
                   border: activeChildId === c.student_id ? "none" : "1px solid var(--border)",
                }}
              >
                {c.name}
              </button>
           ))}
        </div>
      )}

      {loading && activeChildId ? (
          <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
             <div className="spinner" />
          </div>
      ) : recs.length === 0 || recs[0].careers.length === 0 ? (
        <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🤖</div>
          <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Waiting for Data</div>
          <p>
            The AI hasn't generated any recommendations for <b>{activeChild?.name}</b> yet. 
            Encourage them to chat more with MentorAI from their dashboard.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {recs[0].careers.map((career, idx) => (
             <div key={idx} className="card" style={{ padding: "32px", borderTop: idx === 0 ? "3px solid var(--accent-primary)" : "1px solid var(--border)" }}>
               <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "16px", color: idx === 0 ? "var(--accent-primary)" : "var(--text-primary)" }}>
                 {career.title}
               </h2>

               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>✅ Why it fits {activeChild?.name}</h3>
                    <p style={{ fontSize: "14px", lineHeight: 1.6 }}>{career.why_fit}</p>

                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", marginTop: "20px" }}>⚠️ Potential Challenges</h3>
                    <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--text-secondary)" }}>{career.challenges}</p>
                  </div>

                  <div>
                     <div style={{ background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border)", padding: "16px" }}>
                       <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                         🗺️ Summary Roadmap
                       </h3>
                       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div style={{ fontSize: "13px" }}><span style={{ fontWeight: 600, color: "var(--accent-secondary)" }}>Short-term:</span> {career.roadmap.short_term}</div>
                          <div style={{ fontSize: "13px" }}><span style={{ fontWeight: 600, color: "var(--accent-primary)" }}>Mid-term:</span> {career.roadmap.mid_term}</div>
                          <div style={{ fontSize: "13px" }}><span style={{ fontWeight: 600, color: "var(--accent-cyan)" }}>Long-term:</span> {career.roadmap.long_term}</div>
                       </div>
                     </div>
                     
                     <div style={{ marginTop: "16px", background: "rgba(239, 68, 68, 0.05)", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "16px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent-red)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                          🛡️ Recommended Backup Plan
                        </h3>
                        <p style={{ fontSize: "13px", lineHeight: 1.5 }}>{career.backup_plan}</p>
                     </div>
                  </div>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
