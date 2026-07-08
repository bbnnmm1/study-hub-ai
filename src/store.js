const KEY = "study_ai_pro_v2";

export function getData() {
  return (
    JSON.parse(localStorage.getItem(KEY)) || {
      subjects: [],
      lessons: [],
      xp: 0,
      level: 1,
    }
  );
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}