import { useState } from "react";
import { chatAI } from "../api/chatAI";

export default function AI() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);

    const reply = await chatAI(input);
    setResponse(reply);

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>🤖 AI Assistant</h2>

      <textarea
        rows={4}
        style={{ width: "100%" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSend} disabled={loading}>
        {loading ? "..." : "إرسال"}
      </button>

      <h3>الرد:</h3>
      <p>{response}</p>
    </div>
  );
}