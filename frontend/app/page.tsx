"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: "🧠",
    title: "Smart AI Mentor",
    desc: "GPT-4 powered mentor that understands Indian education system — JEE, NEET, UPSC and beyond.",
  },
  {
    icon: "🗺️",
    title: "Personalized Roadmaps",
    desc: "Get short, mid and long-term roadmaps tailored to your interests, skills and budget.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Parent Dashboard",
    desc: "Parents stay informed — view career suggestions, track progress, and stay connected.",
  },
  {
    icon: "🏛️",
    title: "Indian Context",
    desc: "Career advice rooted in Indian realities — government jobs, tier-2 cities, middle-class budgets.",
  },
  {
    icon: "🎯",
    title: "Top 3 Career Paths",
    desc: "No overwhelming choices. AI narrows down to the 3 best-fit careers with honest pros and cons.",
  },
  {
    icon: "💬",
    title: "Bilingual Support",
    desc: "Chat in English or हिंदी — whichever feels more comfortable for you.",
  },
];

const steps = [
  { num: "01", title: "Sign Up", desc: "Create your student or parent account in seconds." },
  { num: "02", title: "Chat with AI", desc: "Answer a few questions at your own pace — no rush." },
  { num: "03", title: "Get Your Roadmap", desc: "Receive 3 personalised career paths with full roadmaps." },
  { num: "04", title: "Track Progress", desc: "Set goals, get reminders, and grow steadily." },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* ── NAV ─────────────────────────────────────── */}
      <nav
        className="glass"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "var(--gradient-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            🎓
          </div>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "18px",
              fontWeight: 700,
            }}
            className="gradient-text"
          >
            MentorAI
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link href="/login" className="btn btn-ghost" style={{ fontSize: "14px" }}>
            Sign In
          </Link>
          <Link href="/signup" className="btn btn-primary" style={{ padding: "9px 20px" }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          paddingTop: "140px",
          paddingBottom: "100px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "20%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "0",
            right: "10%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div
            className="badge badge-purple animate-fade-in"
            style={{ marginBottom: "24px", fontSize: "13px", padding: "6px 14px" }}
          >
            ✨ AI-Powered Career Mentorship for India
          </div>

          <h1
            className="animate-fade-in"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "24px",
              animationDelay: "0.1s",
            }}
          >
            Your Future Career,{" "}
            <span className="gradient-text">Guided by AI</span>
          </h1>

          <p
            className="animate-fade-in"
            style={{
              fontSize: "18px",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: "580px",
              margin: "0 auto 40px",
              animationDelay: "0.2s",
            }}
          >
            MentorAI understands your interests, skills & Indian context to suggest
            the <strong style={{ color: "var(--text-primary)" }}>3 best career paths</strong> — with
            detailed roadmaps, government exams, and backup plans.
          </p>

          <div
            className="animate-fade-in"
            style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap",
              animationDelay: "0.3s",
            }}
          >
            <Link href="/signup" className="btn btn-primary" style={{ fontSize: "16px", padding: "14px 32px" }}>
              Start Your Journey Free →
            </Link>
            <Link href="/login" className="btn btn-secondary" style={{ fontSize: "16px", padding: "14px 28px" }}>
              Sign In
            </Link>
          </div>

          <p style={{ marginTop: "20px", color: "var(--text-muted)", fontSize: "13px" }}>
            No credit card required · Works in English & हिंदी
          </p>
        </div>

        {/* Mock Chat Preview */}
        <div
          className="animate-fade-in"
          style={{
            maxWidth: "700px",
            margin: "60px auto 0",
            padding: "0 24px",
            animationDelay: "0.4s",
          }}
        >
          <div
            className="card"
            style={{
              padding: "24px",
              background: "var(--bg-card)",
              textAlign: "left",
              boxShadow: "var(--shadow-glow), var(--shadow-card)",
            }}
          >
            {/* AI message */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--gradient-brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  flexShrink: 0,
                }}
              >
                🎓
              </div>
              <div
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "0 12px 12px 12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  lineHeight: 1.6,
                  maxWidth: "85%",
                }}
              >
                Hello! 👋 I'm MentorAI — your personal career guide. Tell me, what class are you in, and what subjects do you enjoy the most?
              </div>
            </div>
            {/* User message */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(108,99,255,0.25), rgba(167,139,250,0.15))",
                  border: "1px solid rgba(108,99,255,0.3)",
                  borderRadius: "12px 0 12px 12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  lineHeight: 1.6,
                  maxWidth: "75%",
                }}
              >
                I'm in Class 11 (Science). I love Biology and also enjoy drawing in my free time.
              </div>
            </div>
            {/* AI response */}
            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--gradient-brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  flexShrink: 0,
                }}
              >
                🎓
              </div>
              <div
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "0 12px 12px 12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  lineHeight: 1.6,
                }}
              >
                That's a great combination! Biology + creativity opens up some fascinating paths. 🎨🔬 Could you tell me about your family's budget range — low, medium, or high? This helps me suggest realistic options.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "36px", fontWeight: 700, textAlign: "center", marginBottom: "12px" }}>
          How It <span className="gradient-text">Works</span>
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "56px", fontSize: "16px" }}>
          Four simple steps to your personalised career roadmap
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {steps.map((step) => (
            <div key={step.num} className="card" style={{ padding: "28px 24px", textAlign: "center" }}>
              <div
                className="gradient-text"
                style={{ fontSize: "40px", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "16px" }}
              >
                {step.num}
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>{step.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section style={{ padding: "60px 24px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "36px", fontWeight: 700, textAlign: "center", marginBottom: "12px" }}>
          Everything You <span className="gradient-text">Need</span>
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "56px", fontSize: "16px" }}>
          Built specifically for Indian students & parents
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {features.map((f) => (
            <div key={f.title} className="card" style={{ padding: "28px 24px" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "10px" }}>{f.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section style={{ padding: "80px 24px 100px", textAlign: "center" }}>
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "60px 40px",
            background: "linear-gradient(135deg, rgba(108,99,255,0.1), rgba(6,182,212,0.06))",
            border: "1px solid rgba(108,99,255,0.2)",
            borderRadius: "24px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🚀</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "32px", fontWeight: 700, marginBottom: "16px" }}>
            Ready to find your path?
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "16px", lineHeight: 1.6 }}>
            Join thousands of Indian students already using MentorAI to plan their futures with confidence.
          </p>
          <Link href="/signup" className="btn btn-primary" style={{ fontSize: "16px", padding: "14px 36px" }}>
            Start for Free — No Credit Card Needed
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "32px 24px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "14px",
        }}
      >
        <span className="gradient-text" style={{ fontWeight: 700 }}>MentorAI</span>
        {" "}· AI Career Mentorship for India · Built with ❤️
      </footer>
    </div>
  );
}
