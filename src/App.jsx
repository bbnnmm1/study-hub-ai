import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";

import LessonsPage from "./features/lessons/LessonsPage";
import FilesPage from "./features/files/FilesPage";

import { useEffect, useRef, useState } from "react";
import "./styles/animations.css";

const API_URL = "http://localhost:3001/api/ai";

function AI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error(`السيرفر رد بخطأ (${res.status})`);

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: data.reply || "لا يوجد رد" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "error",
          text: "❌ السيرفر غير متصل. تأكد إنه شغال على localhost:3001",
        },
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className="page-fade"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 30,
        color: "white",
        background: "linear-gradient(135deg,#020617,#312e81)",
      }}
    >
      <h1>🤖 Study Hub AI</h1>
      <p style={{ color: "#94a3b8", marginTop: -10, marginBottom: 20 }}>
        اسأل عن أي مادة وراح يساعدك المساعد الذكي
      </p>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 20,
          borderRadius: 20,
          background: "rgba(255,255,255,.05)",
          border: "1px solid rgba(255,255,255,.1)",
          marginBottom: 15,
        }}
      >
        {messages.length === 0 && (
          <p style={{ textAlign: "center", color: "#64748b", marginTop: 40 }}>
            💬 ابدأ محادثة — اكتب سؤالك بالأسفل
          </p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className="pop-in"
            style={{
              alignSelf: m.role === "user" ? "flex-start" : "flex-end",
              maxWidth: "75%",
              padding: "12px 18px",
              borderRadius: 16,
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              background:
                m.role === "user"
                  ? "#1e2745"
                  : m.role === "error"
                  ? "rgba(239,68,68,.2)"
                  : "linear-gradient(135deg,#8b5cf6,#06b6d4)",
              border: m.role === "error" ? "1px solid #ef4444" : "none",
            }}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <p style={{ alignSelf: "flex-end", color: "#94a3b8" }}>
            🧠 جاري التفكير...
          </p>
        )}

        <div ref={scrollRef} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب سؤالك... (Enter للإرسال)"
          style={{
            flex: 1,
            height: 60,
            resize: "none",
            padding: 15,
            borderRadius: 16,
            background: "#0f172a",
            color: "white",
            border: "1px solid #6366f1",
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="btn-anim"
          style={{
            padding: "0 30px",
            borderRadius: 20,
            border: 0,
            color: "white",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            opacity: loading || !input.trim() ? 0.5 : 1,
            background: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
          }}
        >
          {loading ? "🧠" : "🚀 إرسال"}
        </button>
      </div>
    </div>
  );
}

function Home() {
  const saved = JSON.parse(localStorage.getItem("timer"));

  const [minutes, setMinutes] = useState(saved?.minutes || 25);
  const [seconds, setSeconds] = useState(saved?.seconds || 1500);
  const [running, setRunning] = useState(saved?.running || false);
  const [sessions, setSessions] = useState(
    Number(localStorage.getItem("sessions")) || 0
  );
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("timer", JSON.stringify({ minutes, seconds, running }));
  }, [minutes, seconds, running]);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setRunning(false);

          const newSessions = sessions + 1;
          setSessions(newSessions);
          localStorage.setItem("sessions", newSessions);

          setToast("🎉 انتهت جلسة التركيز");
          setTimeout(() => setToast(""), 4000);

          return minutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  function chooseTime(t) {
    setMinutes(t);
    setSeconds(t * 60);
    setRunning(false);
  }

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  const progress = ((minutes * 60 - seconds) / (minutes * 60)) * 100;

  return (
    <div
      className="page-fade"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
        color: "white",
        background: "radial-gradient(circle at top,#9333ea,#020617 70%)",
        position: "relative",
      }}
    >
      {toast && (
        <div
          className="pop-in"
          style={{
            position: "fixed",
            bottom: 30,
            left: 30,
            padding: "14px 22px",
            borderRadius: 14,
            background: "#1e2745",
            border: "1px solid #34d399",
            zIndex: 999,
          }}
        >
          {toast}
        </div>
      )}

      <div
        className="card-anim"
        style={{
          width: 480,
          padding: 40,
          borderRadius: 40,
          background: "rgba(255,255,255,.08)",
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(255,255,255,.15)",
          boxShadow: "0 30px 80px rgba(0,0,0,.5)",
          textAlign: "center",
        }}
      >
        <h1>Timer</h1>
        <p>اسعى ياعبدي واعينك واذا تنام اهينك</p>

        <h3>⏱️ مدة التركيز</h3>

        <div>
          {[30, 60, 90, 120].map((t) => (
            <button
              key={t}
              onClick={() => chooseTime(t)}
              className="btn-anim"
              style={{
                margin: 6,
                padding: "12px 20px",
                borderRadius: 25,
                border: 0,
                cursor: "pointer",
                color: "white",
                background:
                  minutes === t
                    ? "linear-gradient(135deg,#f59e0b,#ec4899)"
                    : "#334155",
              }}
            >
              {t} دقيقة
            </button>
          ))}
        </div>

        <div
          className={running ? "timer-running" : ""}
          style={{
            width: 310,
            height: 310,
            margin: "45px auto",
            borderRadius: "50%",
            background: `conic-gradient(#facc15 ${progress}%, rgba(255,255,255,.15) ${progress}%)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "background .3s linear",
          }}
        >
          <div
            style={{
              width: 250,
              height: 250,
              borderRadius: "50%",
              background: "linear-gradient(145deg,#020617,#1e1b4b)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 58, fontWeight: "900", color: "#fef3c7" }}>
              {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
            </div>
            <p>{running ? "🔥 يتم التركيز" : " علي وياك"}</p>
          </div>
        </div>

        <button
          onClick={() => setRunning(!running)}
          className="btn-anim"
          style={{
            width: "90%",
            padding: 18,
            borderRadius: 35,
            border: 0,
            cursor: "pointer",
            color: "white",
            fontSize: 19,
            background: running
              ? "linear-gradient(135deg,#ef4444,#f97316)"
              : "linear-gradient(135deg,#22c55e,#06b6d4)",
          }}
        >
          {running ? "⏸ إيقاف" : "بدء"}
        </button>

        <button
          onClick={() => {
            setRunning(false);
            setSeconds(minutes * 60);
          }}
          className="btn-anim"
          style={{
            marginTop: 15,
            width: "90%",
            padding: 15,
            borderRadius: 35,
            border: 0,
            cursor: "pointer",
            color: "white",
            background: "linear-gradient(135deg,#dc2626,#7f1d1d)",
          }}
        >
           إعادة ضبط
        </button>

        <div
          className="card-anim"
          style={{
            marginTop: 30,
            padding: 25,
            borderRadius: 30,
            background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.15)",
          }}
        >
          <h2> جلسات التركيز</h2>
          <h1 style={{ color: "#facc15", fontSize: 45 }}>{sessions}</h1>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const sessions = Number(localStorage.getItem("sessions")) || 0;
  const xp = sessions * 50;
  const level = Math.floor(xp / 200) + 1;
  const progress = (xp % 200) / 2;

  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  function saveTasks(data) {
    setTasks(data);
    localStorage.setItem("tasks", JSON.stringify(data));
  }

  function addTask() {
    if (!task.trim()) return;
    saveTasks([...tasks, { id: Date.now(), text: task, done: false }]);
    setTask("");
  }

  function toggleTask(id) {
    saveTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id) {
    saveTasks(tasks.filter((t) => t.id !== id));
  }

  function startEditing(t) {
    setEditingId(t.id);
    setEditingText(t.text);
  }

  function commitEdit() {
    if (editingText.trim()) {
      saveTasks(
        tasks.map((t) =>
          t.id === editingId ? { ...t, text: editingText.trim() } : t
        )
      );
    }
    setEditingId(null);
  }

  const visibleTasks = tasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  return (
    <div
      className="page-fade"
      style={{
        minHeight: "100vh",
        padding: 35,
        color: "white",
        background: "linear-gradient(135deg,#020617,#312e81)",
      }}
    >
      <h1>📊 لوحة الطالب Pro</h1>

      <div
        className="card-anim stagger-1"
        style={{
          padding: 30,
          borderRadius: 35,
          background: "rgba(255,255,255,.1)",
          backdropFilter: "blur(20px)",
        }}
      >
        <h2>⭐ المستوى {level}</h2>
        <h3>XP : {xp}</h3>

        <div
          style={{
            height: 18,
            background: "#334155",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg,#facc15,#22c55e)",
            }}
          />
        </div>
      </div>

      <div
        className="card-anim stagger-2"
        style={{
          marginTop: 35,
          padding: 30,
          borderRadius: 35,
          background: "rgba(255,255,255,.08)",
        }}
      >
        <h2>📝 مهام اليوم</h2>

        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          placeholder="اكتب مهمة..."
          style={{
            padding: 15,
            borderRadius: 18,
            width: "70%",
            background: "#020617",
            color: "white",
            border: "1px solid #475569",
          }}
        />

        <button
          onClick={addTask}
          className="btn-anim"
          style={{
            margin: 10,
            padding: "14px 25px",
            borderRadius: 20,
            border: 0,
            cursor: "pointer",
            color: "white",
            background: "linear-gradient(135deg,#06b6d4,#2563eb)",
          }}
        >
          ➕ إضافة
        </button>

        <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 15 }}>
          {[
            { key: "all", label: "الكل" },
            { key: "active", label: "غير منجزة" },
            { key: "done", label: "منجزة" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="btn-anim"
              style={{
                padding: "8px 16px",
                borderRadius: 15,
                border: 0,
                cursor: "pointer",
                fontSize: 13,
                color: "white",
                background: filter === f.key ? "#8b5cf6" : "#334155",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {visibleTasks.length === 0 && (
          <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>
            ما عندك مهام هنا
          </p>
        )}

        {visibleTasks.map((t) => (
          <div
            key={t.id}
            className="pop-in"
            style={{
              marginTop: 15,
              padding: 18,
              borderRadius: 22,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: t.done ? "rgba(34,197,94,.25)" : "rgba(255,255,255,.1)",
            }}
          >
            {editingId === t.id ? (
              <input
                autoFocus
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                onBlur={commitEdit}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 12,
                  background: "#020617",
                  color: "white",
                  border: "1px solid #6366f1",
                }}
              />
            ) : (
              <span
                onClick={() => toggleTask(t.id)}
                onDoubleClick={() => startEditing(t)}
                style={{
                  cursor: "pointer",
                  textDecoration: t.done ? "line-through" : "none",
                }}
              >
                {t.done ? "✅" : "📌"} {t.text}
              </span>
            )}

            <button
              onClick={() => deleteTask(t.id)}
              className="btn-anim"
              style={{
                background: "#ef4444",
                color: "white",
                border: 0,
                padding: "8px 15px",
                borderRadius: 15,
                cursor: "pointer",
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Subjects() {
  return (
    <div
      className="page-fade"
      style={{
        minHeight: "100vh",
        padding: 30,
        color: "white",
        background: "#020617",
      }}
    >
      <h1> المواد</h1>
      <p style={{ color: "#94a3b8", marginBottom: 25 }}>
        ما أضفت أي مادة . ابدأ برفع ملف أو درس علمود تظهر هنا.
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <Link
          to="/files"
          className="btn-anim"
          style={{
            padding: "12px 24px",
            borderRadius: 20,
            color: "white",
            textDecoration: "none",
            background: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
          }}
        >
          📁 رفع ملف
        </Link>

        <Link
          to="/lessons"
          className="btn-anim"
          style={{
            padding: "12px 24px",
            borderRadius: 20,
            color: "white",
            textDecoration: "none",
            background: "#334155",
          }}
        >
          📖 إضافة درس
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/lessons" element={<LessonsPage />} />
      </Routes>
    </BrowserRouter>
  );
}