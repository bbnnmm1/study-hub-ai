import { useEffect, useState } from "react";
import { db } from "../../store/db";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await db.subjects.toArray();
    setSubjects(data);
  }

  async function add() {
    if (!name.trim()) return;

    await db.subjects.add({
      name,
      progress: 0,
    });

    setName("");
    load();
  }

  return (
    <div>
      <h1>📚 المواد</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="أضف مادة"
      />
      <button onClick={add}>➕ إضافة</button>

      <div style={{ marginTop: 20 }}>
        {subjects.map((s) => (
          <div key={s.id} style={{ padding: 10, border: "1px solid #ccc", marginBottom: 10 }}>
            <h3>{s.name}</h3>
            <p>التقدم: {s.progress}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}