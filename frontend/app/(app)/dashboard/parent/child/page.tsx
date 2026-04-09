"use client";

import { useEffect, useState } from "react";
import { profileApi, inviteApi, StudentProfile } from "@/lib/api";
import Link from "next/link";

interface ChildLink {
  student_id: string;
  name: string;
  email: string;
}

export default function ChildProfilePage() {
  const [children, setChildren] = useState<ChildLink[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [childProfile, setChildProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
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
    loadData();
  }, []);

  useEffect(() => {
    if (activeChildId) {
      loadProfile(activeChildId);
    }
  }, [activeChildId]);

  async function loadProfile(id: string) {
    try {
      setLoading(true);
      const data = await profileApi.getChildProfile(id);
      setChildProfile(data);
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
           Link your child's account to view their profile, interests, and AI recommendations.
         </p>
         <Link href="/dashboard/parent/invite" className="btn btn-primary" style={{ padding: "12px 24px" }}>
           Link Account Now
         </Link>
       </div>
     );
  }

  const activeChild = children.find(c => c.student_id === activeChildId);

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
        Child Profile 🎓
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
        Understand what your child is interested in, what they are good at, and their concerns.
      </p>

      {/* Child Selector */}
      {children.length > 1 && (
        <div style={{ marginBottom: "24px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
      ) : childProfile ? (
        <div className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "24px" }}>
             <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "white", fontWeight: 700 }}>
               {activeChild?.name[0]?.toUpperCase()}
             </div>
             <div>
               <h2 style={{ fontSize: "20px", fontWeight: 700 }}>{activeChild?.name}</h2>
               <div style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{activeChild?.email}</div>
             </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
             <div>
               <div style={{ fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "6px" }}>Basic Info</div>
               <div style={{ fontSize: "15px", marginBottom: "4px" }}><span style={{ color: "var(--text-secondary)" }}>Age:</span> {childProfile.age || "N/A"}</div>
               <div style={{ fontSize: "15px", marginBottom: "4px" }}><span style={{ color: "var(--text-secondary)" }}>Class:</span> {childProfile.class_level || "N/A"}</div>
               <div style={{ fontSize: "15px", marginBottom: "4px" }}><span style={{ color: "var(--text-secondary)" }}>City:</span> {childProfile.city || "N/A"}</div>
               <div style={{ fontSize: "15px", marginBottom: "4px" }}><span style={{ color: "var(--text-secondary)" }}>Personality:</span> {childProfile.personality || "N/A"}</div>
             </div>

             <div>
               <div style={{ fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "6px" }}>Key Strengths</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {childProfile.skills && childProfile.skills.length > 0 ? (
                    childProfile.skills.map(s => <span key={s} className="chip">{s}</span>)
                  ) : <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Not specified</span>}
                </div>
             </div>
          </div>

          <div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "6px" }}>Interests & Hobbies</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {childProfile.interests && childProfile.interests.length > 0 ? (
                childProfile.interests.map(i => <span key={i} className="badge badge-purple">{i}</span>)
              ) : <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Not specified</span>}
            </div>
          </div>

          {childProfile.confusion && (
            <div style={{ background: "rgba(239, 68, 68, 0.05)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
               <div style={{ fontSize: "13px", color: "var(--accent-red)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                 <span>⚠️</span> Fears / Confusion
               </div>
               <p style={{ fontSize: "14px", lineHeight: 1.6 }}>{childProfile.confusion}</p>
            </div>
          )}

        </div>
      ) : (
         <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            This student hasn't built their profile yet. Ask them to chat with the AI! 🤖
         </div>
      )}
    </div>
  );
}
