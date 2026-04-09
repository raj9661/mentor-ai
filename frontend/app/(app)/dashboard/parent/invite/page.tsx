"use client";

import { useState } from "react";
import { inviteApi } from "@/lib/api";

export default function ParentInvitePage() {
  const [code, setCode] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  async function generateCode() {
    setLoading(true);
    setMessage(null);
    try {
      const data = await inviteApi.create("parent");
      setCode(data.code);
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to generate code", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinCode) return;
    setLoading(true);
    setMessage(null);
    try {
      const data = await inviteApi.join(joinCode);
      setMessage({ text: data.message || "Successfully linked to student!", type: "success" });
      setJoinCode("");
    } catch (err: any) {
      setMessage({ text: err.message || "Invalid or expired code", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setMessage({ text: "Code copied to clipboard!", type: "success" });
    }
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
        Link Student Account 🔗
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "32px", lineHeight: 1.6 }}>
        Monitor your child's progress and see their AI-generated career recommendations.
        You can either generate a code to give to your child, or enter a code your child gave you.
      </p>

      {message && (
        <div className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`} style={{ marginBottom: "24px" }}>
          {message.type === "error" ? "⚠️" : "✅"} {message.text}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Enter Code */}
        <div className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>Enter Student's Code</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
            If your child already generated an invite code from their dashboard, enter it here.
          </p>

          <form onSubmit={handleJoin} style={{ display: "flex", gap: "12px" }}>
            <input
              type="text"
              className="input"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. S9X2M4"
              style={{ textTransform: "uppercase", letterSpacing: joinCode ? "2px" : "normal", fontFamily: joinCode ? "monospace" : "inherit" }}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !joinCode}>
              Link Student 🔗
            </button>
          </form>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
          <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>OR</span>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
        </div>

        {/* Generate Code */}
        <div className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>Generate Invite Code</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
            Alternatively, give this code to your child so they can enter it in their dashboard.
          </p>
          
          {code ? (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                padding: "16px 24px",
                borderRadius: "12px",
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "4px",
                color: "var(--accent-secondary)",
                flex: 1,
                textAlign: "center",
                fontFamily: "monospace"
              }}>
                {code}
              </div>
              <button onClick={copyToClipboard} className="btn btn-secondary" style={{ height: "66px" }}>
                Copy 📋
              </button>
            </div>
          ) : (
            <button onClick={generateCode} className="btn btn-primary" disabled={loading}>
              Generate Parent Code
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
