import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ Missing GEMINI_API_KEY environment variable");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const prompt = `Generate a short, engaging blog post in English for tech enthusiasts.
Topic: A useful free online tool, AI prompt, or productivity hack.
Structure:
- Title (catchy, 5-7 words)
- Short intro (1-2 sentences)
- 3-5 bullet points with practical advice
- Short conclusion with a call-to-action: "Support this site on Ko-fi!"`;

async function generateContent() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  console.log("🤖 Asking Gemini...");
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const today = new Date().toISOString().split("T")[0];
  const outputDir = path.join("site", "posts");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, `${today}.html`);
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${today} – AI-GH-Pages</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  <h1>AI-GH-Pages – ${today}</h1>
  <article>${text.replace(/\n/g, "<br>")}</article>
  <p><a href="https://ko-fi.com/yourusername" target="_blank">☕ Support me on Ko-fi</a></p>
  <p><a href="../index.html">← Back to Home</a></p>
</body>
</html>
`;

  fs.writeFileSync(filePath, html);
  console.log(`✅ Generated: ${filePath}`);

  updateIndex(today);
}

function updateIndex(date) {
  const indexPath = path.join("site", "index.html");
  let indexHTML = fs.existsSync(indexPath)
    ? fs.readFileSync(indexPath, "utf-8")
    : "<h1>AI-GH-Pages – Daily AI Posts</h1><ul>";

  const newEntry = `<li><a href="posts/${date}.html">${date}</a></li>`;
  indexHTML = indexHTML.replace("</ul>", `${newEntry}</ul>`);

  fs.writeFileSync(indexPath, indexHTML);
}

generateContent().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
