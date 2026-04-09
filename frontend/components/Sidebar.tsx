"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const studentNav: NavItem[] = [
  { href: "/dashboard/student", icon: "🏠", label: "Overview" },
  { href: "/dashboard/student/chat", icon: "💬", label: "Chat with AI" },
  { href: "/dashboard/student/recommendations", icon: "🎯", label: "Career Paths" },
  { href: "/dashboard/student/progress", icon: "📈", label: "My Progress" },
  { href: "/dashboard/student/profile", icon: "👤", label: "My Profile" },
  { href: "/dashboard/student/invite", icon: "🔗", label: "Link Parent" },
];

const parentNav: NavItem[] = [
  { href: "/dashboard/parent", icon: "🏠", label: "Overview" },
  { href: "/dashboard/parent/child", icon: "🎓", label: "Child Profile" },
  { href: "/dashboard/parent/recommendations", icon: "🎯", label: "Career Paths" },
  { href: "/dashboard/parent/progress", icon: "📈", label: "Progress" },
  { href: "/dashboard/parent/invite", icon: "🔗", label: "Link Child" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const nav = user?.role === "parent" ? parentNav : studentNav;

  return (
    <aside
      style={{
        width: "240px",
        minWidth: "240px",
        height: "100vh",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        position: "sticky",
        top: 0,
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
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
            flexShrink: 0,
          }}
        >
          🎓
        </div>
        <div>
          <div
            className="gradient-text"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 700 }}
          >
            MentorAI
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
            {user?.role === "parent" ? "Parent Portal" : "Student Portal"}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
        {nav.map((item) => {
          const isActive =
            item.href === pathname ||
            (item.href !== `/dashboard/${user?.role}` && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item${isActive ? " active" : ""}`}
            >
              <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* User info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "10px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--gradient-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "capitalize" }}>
              {user?.role}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="sidebar-item"
          style={{ color: "#ef4444" }}
        >
          <span style={{ fontSize: "16px" }}>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
