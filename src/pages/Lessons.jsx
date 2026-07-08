import { useState } from "react";
import { getData, saveData } from "../store";
import { getOpenExplanation, chatAI, generateQuiz } from "../ai";

export default function Lessons() {
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [ai, setAi] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [chat, setChat] = useState("");
  const [reply, setReply] = useState("");

  const data = getData();

  async function runAI() {
    const store = getData();

    const wiki = await getOpenExplanation(subject || text);
    const questions = generateQuiz(text);

    store.lessons.push({
      id: Date.now(),
      subject,
      text,
    });

    store.xp += 10;
    store.level = Math.floor(store.xp / 50) + 1;

    saveData(store);

    setAi(wiki);
    setQuiz(questions);
  }

  function sendChat() {
    setReply(chatAI(chat));
    setChat("");
  }

  return (
    <div style={{ color: "white" }}>
      <h1>🤖 AI Learning Pro</h1>

      <input
        placeholder="المادة"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={input}
      />

      <textarea
        placeholder="اكتب الدرس"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={input}
      />

      <button onClick={runAI} style={btn}>
        🚀 تشغيل الذكاء
      </button>

      {/* AI */}
      {ai && (
        <div style={card}>
          <h3>🧠 شرح</h3>
          <p>{ai}</p>
        </div>
      )}

      {/* QUIZ */}
      {quiz.length > 0 && (
        <div style={card}>
          <h3>🧪 اختبار</h3>
          {quiz.map((q, i) => (
            <p key={i}>❓ {q.q}</p>
          ))}
        </div>
      )}

      {/* CHAT AI */}
      <div style={card}>
        <h3>💬 Chat AI</h3>

        <input
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          placeholder="اسأل الذكاء..."
          style={input}
        />

        <button onClick={sendChat} style={btn}>
          إرسال
        </button>

        {reply && <p>🤖 {reply}</p>}
      </div>

      {/* LESSONS */}
      <h2>📚 الدروس</h2>

      {data.lessons.map((l) => (
        <div key={l.id} style={card}>
          <b>{l.subject}</b>
          <p>{l.text}</p>
        </div>
      ))}
    </div>
  );
}

const input = { width: "100%", padding: 10, marginBottom: 10 };

const btn = {
  width: "100%",
  padding: 10,
  background: "#06b6d4",
  color: "white",
};

const card = {
  padding: 15,
  marginTop: 10,
  background: "#111827",
};