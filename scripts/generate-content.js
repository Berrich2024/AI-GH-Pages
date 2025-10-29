import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

// === CONFIGURATION GEMINI ===
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// === Date du jour ===
const today = new Date();
const yyyyMmDd = today.toISOString().split("T")[0];
const options = { year: "numeric", month: "long", day: "numeric" };
const readableDate = today.toLocaleDateString("en-US", options);

console.log("📝 Generating AI content for", yyyyMmDd);

// === Liste des prompts (50) ===
const prompts = [
  `Create a 300–400 word article listing 10 free AI tools available today, explain what each does and why they are useful. Make it sound like a curated daily list.`,
  `Write a long article suggesting 5 new side hustle ideas people can start on ${readableDate}, with clear steps and realistic earning potential.`,
  `Generate a detailed article with the "AI Prompt of the Day", giving a clever prompt for ChatGPT or Midjourney, then explain why it works and how to tweak it.`,
  `Write an article about what happened in tech history on ${readableDate}, explain its impact, and give readers a takeaway lesson.`,
  // ... (ajoute les autres prompts ici)
];

const chosenPrompt = prompts[Math.floor(Math.random() * prompts.length)];

const finalPrompt = `
Generate a detailed HTML article between 300 and 400 words using <article>, <h1>, <h2>, and <p> tags.
Make it engaging, SEO-friendly, and well-formatted.
At the very end, add:
<p class="kofi-cta">☕ Support me on <a href="https://ko-fi.com/lumi2024" target="_blank">Ko-Fi</a></p>

Prompt: ${chosenPrompt}
`;

// === Fonction async principale ===
async function generatePost() {
  try {
    const result = await model.generateContent(finalPrompt);

    // Selon la version de l'API, le texte peut être dans result.response.text()
    let aiContent = result.response?.text?.().trim() 
                    || result.response?.[0]?.content?.[0]?.text?.trim()
                    || "No content returned";

    aiContent = aiContent.replace(/```html|```/g, "").trim();

    // === Création du dossier posts si nécessaire ===
    const postsDir = path.join("posts");
    if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir);

    // === Création du fichier HTML ===
    const outputPath = path.join(postsDir, `${yyyyMmDd}.html`);
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Daily Picks - ${yyyyMmDd}</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  <header>
    <h1>AI Daily Picks</h1>
  </header>
  <main>
    ${aiContent}
    <p><a href="../index.html" class="back-link">⬅ Back to Home</a></p>
  </main>
  <footer>
    <p>© 2025 AI Daily Picks</p>
  </footer>
</body>
</html>`;

    fs.writeFileSync(outputPath, html);
    console.log(`✅ Post created at ${outputPath}`);
  } catch (err) {
    console.error("❌ Gemini API error:", err);
  }
}

// === Exécution ===
generatePost();
