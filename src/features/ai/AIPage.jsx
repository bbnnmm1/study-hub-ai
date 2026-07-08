import { useState } from "react";

export default function AI() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const sendToAI = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:3001/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      setResponse("❌ خطأ في الاتصال بالسيرفر");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>🤖 AI Chat</h1>

      <textarea
        rows="4"
        style={{ width: "100%", marginTop: 10 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="اكتب سؤالك..."
      />

      <button onClick={sendToAI} disabled={loading}>
        {loading ? "جاري التفكير..." : "إرسال"}
      </button>

      <div style={{ marginTop: 20 }}>
        <h3>الرد:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
}