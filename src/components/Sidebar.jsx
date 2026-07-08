import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Trophy,
  BarChart3,
  Brain,
  Settings,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 border-l border-slate-700 p-5">
      <h1 className="text-3xl font-bold text-blue-400 mb-8">
        Study Hub AI
      </h1>

      <nav className="space-y-2">

        <Link className="sidebar-link" to="/">
          <LayoutDashboard size={18}/>
          Dashboard
        </Link>

        <Link className="sidebar-link" to="/subjects">
          <BookOpen size={18}/>
          المواد
        </Link>

        <Link className="sidebar-link" to="/lessons">
          <FileText size={18}/>
          الدروس
        </Link>

        <Link className="sidebar-link" to="/quiz">
          🧪 الاختبارات
        </Link>

        <Link className="sidebar-link" to="/analytics">
          <BarChart3 size={18}/>
          Analytics
        </Link>

        <Link className="sidebar-link" to="/assistant">
          <Brain size={18}/>
          AI Assistant
        </Link>

        <Link className="sidebar-link" to="/achievements">
          <Trophy size={18}/>
          الإنجازات
        </Link>

        <Link className="sidebar-link" to="/settings">
          <Settings size={18}/>
          الإعدادات
        </Link>

      </nav>
    </aside>
  );
}