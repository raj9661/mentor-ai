"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { profileApi, recommendationsApi, StudentProfile, CareerRecommendation } from "@/lib/api";

export default function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recs, setRecs] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, recsData] = await Promise.all([
          profileApi.getStudent().catch(() => null),
          recommendationsApi.get().catch(() => []),
        ]);
        setProfile(profData);
        setRecs(recsData);
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

  const isProfileIncomplete = !profile || !profile.age || !profile.class_level || (!profile.interests?.length);
  const hasRecommendations = recs.length > 0 && recs[0].careers.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
          Welcome back! 🎓
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Here's an overview of your career journey.</p>
      </div>

      {isProfileIncomplete && (
        <div
          className="card"
          style={{
            padding: "24px",
            background: "linear-gradient(135deg, rgba(108,99,255,0.1), transparent)",
            border: "1px solid rgba(108,99,255,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "24px" }}>👋</div>
            <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Let's build your profile</h2>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1.6 }}>
            MentorAI needs to know a bit about your interests, skills, and background to suggest the best career paths. The easiest way to do this is to chat with the AI!
          </p>
          <div>
            <Link href="/dashboard/student/chat" className="btn btn-primary" style={{ padding: "10px 24px" }}>
              Start Chat with AI 💬
            </Link>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        
        {/* Profile Snapshot */}
        <div className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>👤</span> My Profile
          </h2>
          {profile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>Class/Grade:</span>
                <span style={{ fontWeight: 500 }}>{profile.class_level || "-"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>City:</span>
                <span style={{ fontWeight: 500 }}>{profile.city || "-"}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Top Interests:</span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {profile.interests && profile.interests.length > 0 ? (
                    profile.interests.map((i, idx) => (
                      <span key={idx} className="chip">{i}</span>
                    ))
                  ) : (
                    <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Not specified</span>
                  )}
                </div>
              </div>
              <Link href="/dashboard/student/profile" style={{ color: "var(--accent-secondary)", fontSize: "14px", marginTop: "8px", textDecoration: "none", fontWeight: 500 }}>
                Edit Full Profile →
              </Link>
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No profile data yet. Chat with the AI to build it!</p>
          )}
        </div>

        {/* Career Paths */}
        <div className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🎯</span> Recommended Paths
          </h2>
          {hasRecommendations ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recs[0].careers.map((career, idx) => (
                <div key={idx} style={{ padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>{career.title}</div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {career.why_fit}
                  </div>
                </div>
              ))}
              <Link href="/dashboard/student/recommendations" style={{ color: "var(--accent-secondary)", fontSize: "14px", marginTop: "8px", textDecoration: "none", fontWeight: 500 }}>
                View Full Roadmaps →
              </Link>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.5 }}>🔮</div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>The AI needs more info to suggest careers.</p>
              <Link href="/dashboard/student/chat" className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                Continue Chat
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
