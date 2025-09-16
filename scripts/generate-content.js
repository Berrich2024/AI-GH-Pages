import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const today = new Date().toISOString().split("T")[0];
const postDir = path.join("posts"); // plus de "site/"
const filePath = path.join(postDir, `${today}.html`);

const prompt = `Write a "Top 10 AI Tools Today" blog post in English, with each tool described in 2-3 sentences. Include a short intro and outro.`;

async function generateContent() {
  console.log("Generating AI content for", today);

  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await res.json();
  const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated.";

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>AI Daily Picks - ${today}</title>
    <link rel="stylesheet" href="../style.css">
  </head>
  <body>
    <h1>AI Daily Picks - ${today}</h1>
    <article>${aiText.replace(/\n/g, "<br>")}</article>
    <p><a href="../index.html">⬅ Back to Home</a></p>
  </body>
  </html>
  `;

  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });
  fs.writeFileSync(filePath, html);
  console.log("✅ Post created at", filePath);
}

generateContent();
