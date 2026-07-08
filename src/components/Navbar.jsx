import { Link } from "react-router-dom";
import {
  Home,
  Book,
  Brain,
  LayoutDashboard,
  BookOpen,
  FileText,
} from "lucide-react";

export default function Navbar() {
  const iconStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    borderRadius: "10px",
    color: "#9ca3af",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        padding: "14px 20px",
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo */}
      <div style={{ fontWeight: "bold" }}>⚡ Study AI</div>

      {/* Links */}
      <div style={{ display: "flex", gap: 15 }}>
        <Link to="/" style={iconStyle}>
          <Home size={18} />
        </Link>

        <Link to="/dashboard" style={iconStyle}>
          <LayoutDashboard size={18} />
        </Link>

        <Link to="/subjects" style={iconStyle}>
          <Book size={18} />
        </Link>

        <Link to="/lessons" style={iconStyle}>
          <BookOpen size={18} />
        </Link>

        <Link to="/files" style={iconStyle}>
          <FileText size={18} />
        </Link>

        <Link to="/ai" style={iconStyle}>
          <Brain size={18} />
        </Link>
      </div>
    </div>
  );
}