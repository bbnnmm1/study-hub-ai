import { useEffect, useState } from "react";
import { db } from "../../store/db";

export default function LessonsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    loadLessons();
  }, []);

  async function loadLessons() {
    const data = await db.lessons
      .orderBy("updatedAt")
      .reverse()
      .toArray();

    setLessons(data);
  }

  async function saveLesson() {
    if (!title.trim()) return;

    if (editingId) {
      const old = await db.lessons.get(editingId);

      await db.lessons.update(editingId, {
        title,
        content,
        notes: old.notes || [],
        updatedAt: new Date().toISOString(),
      });

      setEditingId(null);
    } else {
      await db.lessons.add({
        title,
        content,
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    setTitle("");
    setContent("");
    setNoteInput("");
    loadLessons();
  }

  async function addNote(id) {
    if (!noteInput.trim()) return;

    const lesson = await db.lessons.get(id);

    const newNotes = [
      ...(lesson.notes || []),
      {
        id: Date.now(),
        text: noteInput,
      },
    ];

    await db.lessons.update(id, {
      notes: newNotes,
      updatedAt: new Date().toISOString(),
    });

    setNoteInput("");
    loadLessons();
  }

  async function deleteNote(lessonId, noteId) {
    const lesson = await db.lessons.get(lessonId);

    const filtered = (lesson.notes || []).filter(
      (n) => n.id !== noteId
    );

    await db.lessons.update(lessonId, {
      notes: filtered,
      updatedAt: new Date().toISOString(),
    });

    loadLessons();
  }

  async function deleteLesson(id) {
    await db.lessons.delete(id);
    loadLessons();
  }

  function editLesson(lesson) {
    setEditingId(lesson.id);
    setTitle(lesson.title || "");
    setContent(lesson.content || "");
  }

  function speakArabic(text) {
    if (!text) return;

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "ar-SA";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  }

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h1>📚 الدروس</h1>

      {/* ➕ إضافة درس */}
      <div className="card">
        <input
          placeholder="عنوان الدرس"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        <textarea
          placeholder="محتوى الدرس"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            minHeight: "140px",
            padding: "12px",
            borderRadius: "10px",
            background: "#111827",
            color: "white",
            border: "1px solid #333",
          }}
        />

        <br /><br />

        <button onClick={saveLesson}>
          {editingId ? "💾 حفظ التعديل" : "➕ إضافة درس"}
        </button>
      </div>

      {/* 📖 عرض الدروس */}
      {lessons.map((lesson) => (
        <div key={lesson.id} className="card">
          <h2>{lesson.title}</h2>

          {/* 🔊 الصوت */}
          <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
            <button
              onClick={() =>
                speakArabic(`${lesson.title}. ${lesson.content}`)
              }
            >
              🔊 تشغيل الشرح
            </button>

            <button
              onClick={() => window.speechSynthesis.cancel()}
              style={{ background: "#dc2626" }}
            >
              ⏹ إيقاف
            </button>
          </div>

          {/* 📄 المحتوى */}
          <div style={{ whiteSpace: "pre-wrap" }}>
            {lesson.content}
          </div>

          {/* 📝 إضافة ملاحظة */}
          <div
            style={{
              marginTop: 15,
              padding: 12,
              borderRadius: 14,
              background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: 8 }}>
              📝 إضافة ملاحظة
            </div>

            <textarea
              placeholder="اكتب ملاحظة جديدة..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              style={{
                width: "100%",
                minHeight: "80px",
                borderRadius: 10,
                padding: 10,
                border: "none",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />

            <button onClick={() => addNote(lesson.id)}>
              ➕ إضافة ملاحظة
            </button>
          </div>

          {/* 🧾 عرض الملاحظات */}
          <div style={{ marginTop: 15 }}>
            {lesson.notes?.length > 0 && (
              <div style={{ fontWeight: "bold", marginBottom: 10 }}>
                📝 الملاحظات
              </div>
            )}

            {lesson.notes?.map((note) => (
              <div
                key={note.id}
                style={{
                  marginTop: 10,
                  background:
                    "linear-gradient(135deg,#fbbf24,#f59e0b)",
                  padding: 12,
                  borderRadius: 12,
                  color: "#111827",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ whiteSpace: "pre-wrap", flex: 1 }}>
                  📝 {note.text}
                </div>

                <button
                  onClick={() =>
                    deleteNote(lesson.id, note.id)
                  }
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>

          <hr />

          <button onClick={() => editLesson(lesson)}>
            ✏️ تعديل
          </button>

          <button
            onClick={() => deleteLesson(lesson.id)}
            style={{ marginRight: 10, background: "#dc2626" }}
          >
            🗑 حذف
          </button>
        </div>
      ))}
    </div>
  );
}
