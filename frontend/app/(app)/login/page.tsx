"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
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
      {/* Glow blobs */}
      <div style={{ position: "absolute", top: "20%", left: "15%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div className="animate-fade-in" style={{ width: "100%", maxWidth: "440px", position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 42, height: 42, borderRadius: "12px", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🎓</div>
            <span className="gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 700 }}>MentorAI</span>
          </Link>
          <p style={{ color: "var(--text-secondary)", marginTop: "12px", fontSize: "15px" }}>Welcome back! Sign in to continue.</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: "36px" }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 700, marginBottom: "28px", textAlign: "center" }}>Sign In</h1>

          {error && (
            <div className="alert alert-error animate-fade-in" style={{ marginBottom: "20px" }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="form-group">
              <label className="label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "13px", fontSize: "15px", marginTop: "4px" }}
            >
              {loading ? (
                <><div className="spinner" /> Signing in...</>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
            Don't have an account?{" "}
            <Link href="/signup" style={{ color: "var(--accent-secondary)", fontWeight: 600, textDecoration: "none" }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
