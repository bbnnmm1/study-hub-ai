import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../store/db";

export default function Dashboard() {
  const subjects = useLiveQuery(() => db.subjects.toArray()) || [];

  const avg =
    subjects.length > 0
      ? subjects.reduce((a, b) => a + b.progress, 0) / subjects.length
      : 0;

  return (
    <div>
      <h1>📊 لوحة التحكم</h1>

      <p>عدد المواد: {subjects.length}</p>
      <p>معدل التقدم: {avg.toFixed(1)}%</p>

      {avg > 70 ? (
        <h3>🔥 أداء ممتاز</h3>
      ) : (
        <h3>📘 تحتاج تركز أكثر</h3>
      )}
    </div>
  );
}