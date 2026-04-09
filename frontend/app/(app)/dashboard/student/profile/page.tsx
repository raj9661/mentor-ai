"use client";

import { useEffect, useState } from "react";
import { profileApi, StudentProfile } from "@/lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<StudentProfile>>({});
  const [interestsInput, setInterestsInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await profileApi.getStudent();
        setProfile(data);
        setInterestsInput(data.interests?.join(", ") || "");
        setSkillsInput(data.skills?.join(", ") || "");
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
      const finalProfile = { ...profile };
      finalProfile.interests = interestsInput.split(",").map((s) => s.trim()).filter(Boolean);
      finalProfile.skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
      await profileApi.upsertStudent(finalProfile);
      setMessage("Profile saved successfully! ✅");
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
        My Profile 👤
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
        The more details you provide, the better MentorAI can guide you. Most of this info is automatically gathered when you chat!
      </p>

      {message && (
        <div className={`alert ${message.startsWith("Error") ? "alert-error" : "alert-success"}`} style={{ marginBottom: "20px" }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div className="form-group">
            <label className="label">Age</label>
            <input name="age" type="number" className="input" value={profile.age || ""} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="label">Class/Grade</label>
            <select name="class_level" className="input" value={profile.class_level || ""} onChange={handleChange}>
              <option value="">Select...</option>
              {["8th", "9th", "10th", "11th", "12th", "College 1st Year", "College 2nd Year", "College 3rd Year", "Final Year of College", "Graduated", "Master's"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="label">City</label>
          <input name="city" type="text" className="input" value={profile.city || ""} onChange={handleChange} placeholder="e.g. Pune, Maharashtra" />
        </div>

        <div className="form-group">
          <label className="label">Interests & Hobbies (comma separated)</label>
          <input type="text" className="input" value={interestsInput} onChange={(e) => setInterestsInput(e.target.value)} placeholder="Coding, Cricket, Drawing..." />
        </div>

        <div className="form-group">
          <label className="label">Strong Skills (comma separated)</label>
          <input type="text" className="input" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Maths, Communication, Logic..." />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div className="form-group">
            <label className="label">Personality</label>
            <select name="personality" className="input" value={profile.personality || ""} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Introvert">Introvert</option>
              <option value="Extrovert">Extrovert</option>
              <option value="Ambivert">Ambivert</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">Budget Level</label>
            <select name="budget_level" className="input" value={profile.budget_level || ""} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Low (Government Colleges preferred)">Low (Govt Preferred)</option>
              <option value="Medium">Medium</option>
              <option value="High (Private Colleges OK)">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="label">Parental Expectations</label>
          <input name="parent_pressure" type="text" className="input" value={profile.parent_pressure || ""} onChange={handleChange} placeholder="e.g. They want me to do Engineering..." />
        </div>

        <div className="form-group">
          <label className="label">Main Confusions / Fears</label>
          <textarea name="confusion" className="input" rows={3} value={profile.confusion || ""} onChange={handleChange} placeholder="What worries you about the future?" />
        </div>

        <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <><div className="spinner" /> Saving...</> : "Save Profile 💾"}
          </button>
        </div>
      </form>
    </div>
  );
}
