import fs from "fs";
import path from "path";

const today = new Date().toISOString().split("T")[0];
const postDir = path.join("posts");
const filePath = path.join(postDir, `${today}.html`);

const prompt = `Write a "Top 10 AI Tools Today" blog post in English.
Each tool must have 2-3 sentences description.
Add a short intro and a short outro paragraph.`;

// === MAIN FUNCTION ===
async function generateContent() {
  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

  console.log("📝 Generating AI content for", today);

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/chat-bison-001:generateMessage?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: {
          messages: [{ author: "user", content: prompt }],
        },
        temperature: 0.7,
      }),
    }
  );

  const data = await res.json();
  console.log("🔎 API response:", JSON.stringify(data, null, 2));

  // Chat-bison renvoie le texte dans candidates[0].content
  const aiText = data?.candidates?.[0]?.content || "No content generated.";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Daily Picks - ${today}</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>AI Daily Picks - ${today}</h1>
  <article>${aiText.replace(/\n/g, "<br>")}</article>
  <p><a href="/index.html">⬅ Back to Home</a></p>
</body>
</html>`;

  fs.writeFileSync(filePath, html);
  console.log("✅ Post created at", filePath);
}

generateContent();
