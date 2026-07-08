import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ai", (req, res) => {
  const { message } = req.body;

  res.json({
    reply: "🤖 وصلني: " + message,
  });
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});