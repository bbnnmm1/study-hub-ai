import Dexie from "dexie";

export const db = new Dexie("study_ai_db");

/*
  📚 lessons = الدروس
  📝 notes داخل كل درس (array)
  📁 files = الملازم + الوزاريات
*/

db.version(6).stores({
  lessons: "++id, title, content, createdAt, updatedAt",
  files: "++id, name, type, url, createdAt",
});