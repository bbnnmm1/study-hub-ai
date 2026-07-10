import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// فحص المفتاح عند الإقلاع، مو بعد أول طلب فاشل
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY غير موجود بملف .env — أوقف السيرفر");
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 20 * 1000, // 20 ثانية بدل الافتراضي الطويل جداً
  maxRetries: 1,
});

const SYSTEM_PROMPT = `أنت مساعد دراسي ذكي اسمه Study Hub AI.
أجب باللغة العربية بشكل واضح ومفيد للطلاب.
اختصر إجابتك إذا كان السؤال بسيط، وفصّل إذا كان معقد.`;

app.post("/api/ai", async (req, res) => {
  const { message, history } = req.body;

  // تحقق سريع بدون ما نتعب OpenAI بطلب فاضي
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ reply: "اكتب سؤال قبل الإرسال" });
  }

  if (message.length > 4000) {
    return res.status(400).json({ reply: "السؤال طويل جداً، اختصره شوي" });
  }

  try {
    // نبني السياق من تاريخ المحادثة (إذا الفرونت يرسله) عشان الذكاء الاصطناعي يتذكر
    const previousTurns = Array.isArray(history)
      ? history
          .slice(-10) // آخر 10 رسائل بس، عشان ما يكبر الطلب أكثر من اللازم
          .map((h) => `${h.role === "user" ? "الطالب" : "المساعد"}: ${h.text}`)
          .join("\n")
      : "";

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `${SYSTEM_PROMPT}

${previousTurns ? `سياق المحادثة السابقة:\n${previousTurns}\n` : ""}
سؤال الطالب الحالي:
${message}`,
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("AI request failed:", error.message);

    // نفرّق بين نوع الخطأ عشان الرسالة تكون مفيدة فعلاً
    if (error.status === 401) {
      return res.status(500).json({ reply: "مشكلة بمفتاح الـ API، تواصل مع الدعم" });
    }
    if (error.status === 429) {
      return res.status(429).json({ reply: "الطلبات كثيرة حالياً، جرب بعد شوي" });
    }
    if (error.name === "APIConnectionTimeoutError" || error.code === "ETIMEDOUT") {
      return res.status(504).json({ reply: "الرد تأخر كثير، جرب مرة ثانية" });
    }

    res.status(500).json({ reply: "حدث خطأ في الذكاء الاصطناعي، جرب مرة ثانية" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// يمنع طيحان السيرفر بالكامل لو صار خطأ غير متوقع بمكان ثاني
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

app.listen(3001, () => {
  console.log("✅ AI Server running on port 3001");
});