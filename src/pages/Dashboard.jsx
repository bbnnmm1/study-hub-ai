import { getData } from "../store";

export default function Dashboard() {
  const data = getData();

  return (
    <div style={{ color: "white" }}>
      <h1>📊 Dashboard</h1>

      <div style={card}>📚 المواد: {data.subjects.length}</div>
      <div style={card}>📖 الدروس: {data.lessons.length}</div>
      <div style={card}>⭐ XP: {data.xp}</div>
      <div style={card}>🏆 Level: {data.level}</div>

      <h3>🔥 تقدمك</h3>
      <div style={bar}>
        <div style={{ ...fill, width: `${Math.min(data.xp, 100)}%` }} />
      </div>
    </div>
  );
}

const card = {
  padding: 15,
  marginTop: 10,
  background: "#111827",
};

const bar = {
  width: "100%",
  height: 10,
  background: "#1f2937",
  marginTop: 10,
};

const fill = {
  height: "100%",
  background: "#22d3ee",
};