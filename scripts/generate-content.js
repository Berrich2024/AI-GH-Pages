import fs from "fs";
import path from "path";

const today = new Date().toISOString().split("T")[0];
const postDir = path.join("posts");
const filePath = path.join(postDir, `${today}.html`);

// Ton prompt
const prompt = `Write a "Top 10 AI Tools Today" blog post in English, with each tool described in 2-3 sentences. Include a short intro and outro.`;

async function generateContent() {
  console.log("Generating AI content for", today);

  // Appel à Gemini
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  const data = await res.json();
  const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated.";

  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

  // Créer le post
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

  // Mettre à jour index.html avec la liste des posts
  const posts = fs.readdirSync(postDir)
    .filter(f => f.endsWith(".html"))
    .sort((a, b) => b.localeCompare(a))
    .map(f => `<li><a href="/posts/${f}">${f.replace(".html", "")}</a></li>`)
    .join("\n");

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Daily Picks</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>AI Daily Picks</h1>
  <p>Fresh AI-curated content every day.</p>
  <p>Support this project on <a href="https://ko-fi.com/yourusername" target="_blank">Ko-fi</a> ☕</p>

  <h2>Latest Posts</h2>
  <ul>
    ${posts}
  </ul>
</body>
</html>`;

  fs.writeFileSync("index.html", indexHtml);
  console.log("✅ index.html updated");
}

generateContent();
