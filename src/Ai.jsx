const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 ثانية

try {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, history: messages }),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  // ... باقي الكود
} catch (err) {
  clearTimeout(timeoutId);
  if (err.name === "AbortError") {
    // اعرض رسالة "الطلب أخذ وقت طويل" بدل ما يضل معلّق
  }
}