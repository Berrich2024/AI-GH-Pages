import fs from "fs";
import path from "path";
import fetch from "node-fetch"; // Node 20 a fetch intégré, mais ça marche aussi

// Date du jour
const today = new Date().toISOString().split("T")[0];
const postDir = path.join("posts");
const filePath = path.join(postDir, `${today}.html`);

// Ton prompt
const prompt = `Write a "Top 10 AI Tools Today" blog post in English, each tool in 2-3 sentences. Include intro and outro.`;

async function generateContent() {
  // Créer le dossier posts s'il n'existe pas
  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

  // Appel API texte standard de Google Gemini
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText?key=" + process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: { text: prompt },
        temperature: 0.7
      }),
    }
  );

  const data = await res.json();

  // Récupérer le texte généré
  const aiText = data?.candidates?.[0]?.content || "No content generated.";

  // Créer le fichier HTML
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
