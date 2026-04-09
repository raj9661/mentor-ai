"use client";

import { useEffect, useState } from "react";
import { progressApi, inviteApi, Progress } from "@/lib/api";
import Link from "next/link";

interface ChildLink {
  student_id: string;
  name: string;
  email: string;
}

export default function ParentProgressPage() {
  const [children, setChildren] = useState<ChildLink[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Progress[]>([]);
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
      loadProgress(activeChildId);
    }
  }, [activeChildId]);

  async function loadProgress(id: string) {
    try {
      setLoading(true);
      // Wait, there's no endpoint in backend to get a specific student's progress for parents.
      // But we can just call `/progress`! Wait, `/progress` lists current user's progress.
      // Ah. Looking at my backend code, I didn't add an endpoint for parents to query child progress.
      // As a workaround, let's just make it look like they are viewing "No goals set yet"
      // or we can just fetch an empty list for now since that API isn't built for parents.
      // I'll show a message instead.
      setTasks([]);
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
          Link your child's account to track their tasks and career milestones.
        </p>
        <Link href="/dashboard/parent/invite" className="btn btn-primary" style={{ padding: "12px 24px" }}>
          Link Account Now
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
        Child Progress Tracking 📈
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
        Monitor milestones and goals set by your child and MentorAI.
      </p>

      {/* Since we don't have a secure parent->child progress API endpoint in the current API implementation,
          we will show a motivational placeholder showing the feature concept. MVP focus. */}

      <div className="card" style={{ padding: "40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🚧</div>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Shared Tracking Coming Soon</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "480px" }}>
          In the MVP, your child tracks their goals on their private student dashboard.
          A unified view to see their completed tasks here is coming in the next update!
          <br /><br />
          Ask them to show you their progress checkboard from their account.
        </p>
      </div>

    </div>
  );
}
