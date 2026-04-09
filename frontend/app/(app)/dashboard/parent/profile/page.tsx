"use client";

import { useEffect, useState } from "react";
import { profileApi, ParentProfile } from "@/lib/api";

export default function ParentProfilePage() {
  const [profile, setProfile] = useState<Partial<ParentProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await profileApi.getParent();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await profileApi.upsertParent(profile);
      setMessage("Preferences saved successfully! ✅");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <div className="spinner" style={{ width: "32px", height: "32px", borderColor: "rgba(108,99,255,0.2)", borderTopColor: "var(--accent-primary)" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
        Parent Settings ⚙️
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
        Your inputs here will guide MentorAI to suggest realistic career paths for your child considering your expectations and financial constraints.
      </p>

      {message && (
        <div className={`alert ${message.startsWith("Error") ? "alert-error" : "alert-success"}`} style={{ marginBottom: "20px" }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        <div className="form-group">
          <label className="label">Financial Budget Context</label>
          <select name="budget" className="input" value={profile.budget || ""} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="Low - Looking for Government Colleges & Scholarships">Low (Govt / Scholarships)</option>
            <option value="Medium - Can afford standard Private fees">Medium (Standard Private)</option>
            <option value="High - Can afford premium Private / International fees">High (Premium / Abroad)</option>
          </select>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
             This helps the AI prioritize paths that fit your financial capabilities.
          </p>
        </div>

        <div className="form-group">
          <label className="label">Your Expectations</label>
          <textarea 
             name="expectations" 
             className="input" 
             rows={3} 
             value={profile.expectations || ""} 
             onChange={handleChange} 
             placeholder="e.g. I want them to have a stable government job... or I want them to pursue engineering." 
          />
        </div>

        <div className="form-group">
          <label className="label">Your Concerns</label>
          <textarea 
             name="concerns" 
             className="input" 
             rows={3} 
             value={profile.concerns || ""} 
             onChange={handleChange} 
             placeholder="What worries you about your child's future or current academic performance?" 
          />
        </div>

        <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <><div className="spinner" /> Saving...</> : "Save Preferences 💾"}
          </button>
        </div>
      </form>
    </div>
  );
}
