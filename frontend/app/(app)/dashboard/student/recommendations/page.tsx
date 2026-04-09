"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { recommendationsApi, CareerRecommendation } from "@/lib/api";

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await recommendationsApi.get();
        // Backend returns an array desc chronologically.
        setRecs(data);
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
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <div className="spinner" style={{ width: "32px", height: "32px", borderColor: "rgba(108,99,255,0.2)", borderTopColor: "var(--accent-primary)" }} />
      </div>
    );
  }

  if (recs.length === 0 || recs[0].careers.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.8 }}>🔮</div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>
          No Career Paths Yet
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px", maxWidth: "400px", margin: "0 auto 24px" }}>
          Chat with MentorAI so it can understand your interests, skills, and budget to generate personalized career recommendations.
        </p>
        <Link href="/dashboard/student/chat" className="btn btn-primary" style={{ padding: "12px 24px" }}>
          Start Chatting Now
        </Link>
      </div>
    );
  }

  const latestRecList = recs[0].careers;

  return (
    <div>
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
            Your Recommended Paths 🎯
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Based on our conversation, here are the top 3 careers tailored for you.
          </p>
        </div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)", padding: "6px 12px", background: "var(--bg-secondary)", borderRadius: "100px", border: "1px solid var(--border)" }}>
          Updated: {new Date(recs[0].created_at).toLocaleDateString()}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {latestRecList.map((career, idx) => (
          <div key={idx} className="card" style={{ padding: "32px", position: "relative", overflow: "hidden" }}>
            {/* Number background */}
            <div style={{ position: "absolute", top: "-20px", right: "-10px", fontSize: "180px", fontWeight: 800, color: "rgba(108,99,255,0.03)", lineHeight: 1, pointerEvents: "none", fontFamily: "'Space Grotesk', sans-serif" }}>
              {idx + 1}
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px", color: "var(--accent-secondary)" }}>
              {career.title}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", position: "relative", zIndex: 1 }}>
              {/* Left Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>✅ Why it fits you</h3>
                  <p style={{ fontSize: "15px", lineHeight: 1.6 }}>{career.why_fit}</p>
                </div>

                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>🌏 Scope in India</h3>
                  <p style={{ fontSize: "15px", lineHeight: 1.6 }}>{career.india_scope}</p>
                </div>

                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>⚠️ Challenges</h3>
                  <p style={{ fontSize: "15px", lineHeight: 1.6, color: "var(--text-secondary)" }}>{career.challenges}</p>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {career.government_opportunities && career.government_opportunities.toLowerCase() !== "null" && (
                  <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "16px", borderRadius: "12px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent-green)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>🏛️</span> Govt Opportunities
                    </h3>
                    <p style={{ fontSize: "14px", lineHeight: 1.5 }}>{career.government_opportunities}</p>
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>🗺️ Roadmap</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "2px solid var(--border)", paddingLeft: "16px" }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "-23px", top: "5px", width: "10px", height: "10px", borderRadius: "50%", background: "var(--accent-secondary)", border: "2px solid var(--bg-card)" }} />
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "2px" }}>Short Term (1-3 months)</div>
                      <div style={{ fontSize: "14px" }}>{career.roadmap.short_term}</div>
                    </div>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "-23px", top: "5px", width: "10px", height: "10px", borderRadius: "50%", background: "var(--accent-primary)", border: "2px solid var(--bg-card)" }} />
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "2px" }}>Mid Term (6-12 months)</div>
                      <div style={{ fontSize: "14px" }}>{career.roadmap.mid_term}</div>
                    </div>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "-23px", top: "5px", width: "10px", height: "10px", borderRadius: "50%", background: "var(--accent-cyan)", border: "2px solid var(--bg-card)" }} />
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "2px" }}>Long Term (2-5 years)</div>
                      <div style={{ fontSize: "14px" }}>{career.roadmap.long_term}</div>
                    </div>
                  </div>
                </div>

                <div style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "16px", borderRadius: "12px", marginTop: "auto" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent-red)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>🛡️</span> Backup Plan
                  </h3>
                  <p style={{ fontSize: "14px", lineHeight: 1.5 }}>{career.backup_plan}</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border)", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", marginRight: "4px" }}>Required Skills:</span>
              {career.skills.map(s => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
