"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const { signup } = useAuth();
  const [role, setRole] = useState<"student" | "parent">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password, role);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "15%", right: "15%", width: "450px", height: "450px", background: "radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", left: "10%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div className="animate-fade-in" style={{ width: "100%", maxWidth: "460px", position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 42, height: 42, borderRadius: "12px", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🎓</div>
            <span className="gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 700 }}>MentorAI</span>
          </Link>
          <p style={{ color: "var(--text-secondary)", marginTop: "12px", fontSize: "15px" }}>Create your free account — takes 30 seconds.</p>
        </div>

        <div className="card" style={{ padding: "36px" }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 700, marginBottom: "28px", textAlign: "center" }}>Get Started</h1>

          {/* Role Toggle */}
          <div style={{ display: "flex", background: "var(--bg-secondary)", borderRadius: "12px", padding: "4px", marginBottom: "24px", border: "1px solid var(--border)" }}>
            {(["student", "parent"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "9px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                  background: role === r ? "var(--gradient-brand)" : "transparent",
                  color: role === r ? "white" : "var(--text-secondary)",
                  boxShadow: role === r ? "0 2px 12px rgba(108,99,255,0.3)" : "none",
                }}
              >
                {r === "student" ? "🎓 Student" : "👨‍👩‍👧 Parent"}
              </button>
            ))}
          </div>

          {error && (
            <div className="alert alert-error animate-fade-in" style={{ marginBottom: "20px" }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="form-group">
              <label className="label" htmlFor="name">Full Name</label>
              <input id="name" type="text" className="input" placeholder="Ravi Kumar" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="email">Email Address</label>
              <input id="email" type="email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="password">Password</label>
              <input id="password" type="password" className="input" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={8} />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "13px", fontSize: "15px", marginTop: "4px" }}
            >
              {loading ? (
                <><div className="spinner" /> Creating account...</>
              ) : (
                `Create ${role === "student" ? "Student" : "Parent"} Account →`
              )}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--accent-secondary)", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", marginTop: "16px" }}>
          By signing up, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
