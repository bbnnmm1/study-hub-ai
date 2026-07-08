import { useState } from "react";
import { getData, saveData } from "../store";

export default function Subjects() {
  const [name, setName] = useState("");

  function add() {
    const data = getData();

    data.subjects.push({
      id: Date.now(),
      name,
    });

    saveData(data);
    setName("");
    window.location.reload();
  }

  const data = getData();

  return (
    <div>
      <h1>📚 المواد</h1>

      <input value={name} onChange={(e) => setName(e.target.value)} />

      <button onClick={add}>إضافة مادة</button>

      {data.subjects.map((s) => (
        <div key={s.id}>📘 {s.name}</div>
      ))}
    </div>
  );
}