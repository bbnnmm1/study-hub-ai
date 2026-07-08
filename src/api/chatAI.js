export async function chatAI(message) {
  try {
    const res = await fetch("http://localhost:3001/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Server error");
    }

    return data.reply;
  } catch (err) {
    console.error(err);
    return "❌ خطأ بالسيرفر";
  }
}