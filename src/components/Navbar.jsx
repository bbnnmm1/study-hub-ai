import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Book,
  Brain,
  LayoutDashboard,
  BookOpen,
  FileText,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "الرئيسية" },
  { to: "/dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
  { to: "/subjects", icon: Book, label: "المواد" },
  { to: "/lessons", icon: BookOpen, label: "الدروس" },
  { to: "/files", icon: FileText, label: "الملفات" },
  { to: "/ai", icon: Brain, label: "المساعد الذكي" },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 20px",
        background: "rgba(10,14,26,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          fontWeight: "bold",
          color: "white",
          textDecoration: "none",
          fontSize: 16,
        }}
      >
        ⚡ Study AI
      </Link>

      {/* Desktop links */}
      <div
        className="navbar-links"
        style={{
          display: "flex",
          gap: 6,
        }}
      >
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              title={label}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                borderRadius: "10px",
                color: active ? "#a78bfa" : "#9ca3af",
                background: active ? "rgba(139,92,246,0.15)" : "transparent",
                textDecoration: "none",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={18} />
            </Link>
          );
        })}
      </div>

      {/* Mobile hamburger button */}
      <button
        className="navbar-hamburger"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={mobileOpen}
        style={{
          display: "none",
          background: "transparent",
          border: 0,
          color: "white",
          cursor: "pointer",
          padding: 8,
        }}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            insetInline: 0,
            background: "rgba(10,14,26,0.98)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            padding: 12,
          }}
        >
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 12,
                  color: active ? "#a78bfa" : "#e5e7eb",
                  background: active ? "rgba(139,92,246,0.15)" : "transparent",
                  textDecoration: "none",
                  fontSize: 15,
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Responsive breakpoint: hide desktop links, show hamburger below 640px */}
      <style>{`
        @media (max-width: 640px) {
          .navbar-links { display: none !important; }
          .navbar-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}