import { useState } from "react";

export default function AI() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
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
      setResponse("❌ خطأ بالاتصال بالسيرفر");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h1>🤖 AI Assistant</h1>

      <textarea
        rows={4}
        style={{ width: "100%", padding: 10 }}
        placeholder="اكتب سؤالك..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {loading ? "جاري التفكير..." : "إرسال"}
      </button>

      <div style={{ marginTop: 20 }}>
        <h3>الرد:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
}