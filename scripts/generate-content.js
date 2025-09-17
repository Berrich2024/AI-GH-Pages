// scripts/generate-content.js
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const today = new Date().toISOString().split("T")[0];
console.log("📝 Generating AI content for", today);

const prompt = `
Generate a short, engaging article (50-80 words) about today's date, including one fun historical fact.
Format it as simple HTML inside an <article> tag.
`;

try {
  const result = await model.generateContent(prompt);
  const aiContent = result.response.text().trim();

  // Créer dossier posts/ si manquant
  const postsDir = path.join("posts");
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir);

  const outputPath = path.join(postsDir, `${today}.html`);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Daily Picks - ${today}</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>AI Daily Picks - ${today}</h1>
  ${aiContent}
  <p><a href="/index.html">⬅ Back to Home</a></p>
</body>
</html>`;

  fs.writeFileSync(outputPath, html);
  console.log(`✅ Post created at ${outputPath}`);
} catch (err) {
  console.error("❌ Gemini API error:", err);
}
