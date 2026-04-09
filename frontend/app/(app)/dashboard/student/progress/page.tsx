"use client";

import { useEffect, useState } from "react";
import { progressApi, Progress } from "@/lib/api";

export default function ProgressPage() {
  const [tasks, setTasks] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await progressApi.list();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!goal) return;
    setAdding(true);
    try {
      const newTask = await progressApi.create({ goal, deadline: deadline || undefined });
      setTasks(prev => [newTask, ...prev]);
      setGoal("");
      setDeadline("");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(id: string, currentStatus: string) {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
    try {
      await progressApi.update(id, { status: newStatus });
    } catch (err) {
      // Revert on error
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: currentStatus as any } : t));
    }
  }

  async function handleDelete(id: string) {
    // Optimistic remove
    const backup = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await progressApi.delete(id);
    } catch (err) {
      setTasks(backup);
    }
  }

  const completedCount = tasks.filter(t => t.status === "completed").length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <div className="spinner" style={{ width: "32px", height: "32px", borderColor: "rgba(108,99,255,0.2)", borderTopColor: "var(--accent-primary)" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
        My Progress 📈
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
        Break down your career roadmap into actionable goals and track them here.
      </p>

      {/* Overview Card */}
      <div className="card" style={{ padding: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600 }}>Overall Progress</h2>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent-secondary)" }}>
            {completedCount} / {tasks.length} Completed
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAdd} className="card" style={{ padding: "20px", marginBottom: "32px", display: "flex", gap: "12px", alignItems: "flex-end" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="label">New Goal / Action Item</label>
          <input
            type="text"
            className="input"
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="e.g. Complete chapter 1 of Physics"
            required
          />
        </div>
        <div className="form-group" style={{ width: "160px" }}>
          <label className="label">Deadline (Optional)</label>
          <input
            type="date"
            className="input"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={!goal || adding} style={{ padding: "12px 20px" }}>
          {adding ? <div className="spinner" /> : "Add ➕"}
        </button>
      </form>

      {/* Task List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {tasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", background: "var(--bg-card)", borderRadius: "12px", border: "1px dashed var(--border)" }}>
            No goals set yet. Start tracking your roadmap!
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className="card"
              style={{
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                opacity: task.status === "completed" ? 0.6 : 1,
                transition: "all 0.2s ease"
              }}
            >
              <button
                onClick={() => handleToggle(task.id, task.status)}
                style={{
                  width: 24, height: 24, borderRadius: "6px",
                  border: task.status === "completed" ? "none" : "2px solid var(--border)",
                  background: task.status === "completed" ? "var(--accent-green)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0, padding: 0
                }}
              >
                {task.status === "completed" && <span style={{ color: "white", fontSize: "14px" }}>✓</span>}
              </button>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  textDecoration: task.status === "completed" ? "line-through" : "none",
                  color: task.status === "completed" ? "var(--text-secondary)" : "var(--text-primary)"
                }}>
                  {task.goal}
                </div>
                {task.deadline && (
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span>📅</span>
                    {new Date(task.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                className="btn btn-ghost"
                style={{ padding: "6px", color: "var(--text-muted)" }}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
