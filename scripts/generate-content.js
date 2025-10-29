import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const today = new Date();
const yyyyMmDd = today.toISOString().split("T")[0];
const options = { year: "numeric", month: "long", day: "numeric" };
const readableDate = today.toLocaleDateString("en-US", options);

console.log("📝 Generating AI content for", yyyyMmDd);

// 🧠 Liste des prompts (50, pour changer chaque jour)
const prompts = [
  `Create a 300–400 word article listing 10 free AI tools available today, explain what each does and why they are useful. Make it sound like a curated daily list.`,
  `Write a long article suggesting 5 new side hustle ideas people can start on ${readableDate}, with clear steps and realistic earning potential.`,
  `Generate a detailed article with the "AI Prompt of the Day", giving a clever prompt for ChatGPT or Midjourney, then explain why it works and how to tweak it.`,
  `Write an article about what happened in tech history on ${readableDate}, explain its impact, and give readers a takeaway lesson.`,
  `Create a "free resources" roundup of at least 8 SaaS tools or websites worth trying today, with short descriptions and benefits.`,
  `Generate a detailed guide explaining how to make $10 online in one hour using legitimate free methods, step by step.`,
  `Write about a trending AI tool released recently, explain how to use it and why it matters for creators.`,
  `Create a 350-word article listing 5 free design resources (fonts, templates, icons) people can download today.`,
  `Write a blog post about one historical breakthrough that happened on ${readableDate} in computing or the internet.`,
  `Generate an in-depth post with 3 new AI image prompts (for Midjourney/Stable Diffusion) that produce beautiful results.`,
  `Create a tutorial-style article explaining how to automate a small task with free no-code tools.`,
  `Write an article describing 5 passive income ideas that still work in 2025, explain pros and cons.`,
  `Generate a detailed post recommending 5 free courses available online this week (coding, AI, design).`,
  `Write about one inspiring tech entrepreneur born on ${readableDate}, their achievements, and what we can learn.`,
  `Create a "Top 10 free Chrome extensions" list with explanations on how they save time.`,
  `Generate a 300-word article about one major tech acquisition that happened on ${readableDate} in history.`,
  `Write an article giving 10 practical productivity tips powered by free AI tools.`,
  `Create a daily "AI news digest" article summarizing the 3 biggest AI headlines this week.`,
  `Write a guide about using AI for content creation with free tools, step by step.`,
  `Generate a tutorial about building a personal brand using free online resources.`,
  `Write about a famous open-source software project launched near ${readableDate}, explain its impact.`,
  `Create an article listing 10 free apps that improve focus and reduce procrastination.`,
  `Generate a post explaining how to get started freelancing with no budget.`,
  `Write a 350-word piece with an inspirational story about someone who built a business from free tools.`,
  `Create an article listing free datasets people can use for machine learning practice.`,
  `Generate a blog post about 5 free AI APIs developers should try this month.`,
  `Write an article explaining how to monetize a blog with ads and affiliates, using free platforms.`,
  `Create a "Daily Coding Challenge" article with a problem + solution explained.`,
  `Generate a roundup of 10 open-source projects worth contributing to today.`,
  `Write about one famous invention patented on ${readableDate} and its importance.`,
  `Create a "free marketing hacks" article with at least 6 tips using free tools.`,
  `Generate a motivational article about learning one new skill per day with free resources.`,
  `Write an article about 3 ways to use AI to make extra income online.`,
  `Create a blog post listing 5 new AI image styles to try and sample prompts.`,
  `Generate an article about one famous tech product released on ${readableDate}.`,
  `Write about how to start a newsletter for free, step by step.`,
  `Create a "free templates of the day" roundup with download links.`,
  `Generate an article about free and legal ways to get stock photos for projects.`,
  `Write a detailed post on how to make a free personal website and portfolio.`,
  `Create a list of 5 underrated YouTube channels teaching coding or AI for free.`,
  `Generate a 350-word article about how AI will change freelancing by 2030.`,
  `Write an article listing the best free AI tools for small businesses.`,
  `Create a post about how to find free remote jobs or internships online.`,
  `Generate an article about free resources for learning prompt engineering.`,
  `Write a blog post about 5 free productivity planners and Notion templates.`,
  `Create an article listing 10 websites offering free e-books legally.`,
  `Generate a post about free browser-based games to relax after work.`,
  `Write a guide explaining how to start earning with print-on-demand for $0.`,
  `Create a daily tech inspiration article with a quote + 3 actionable tips.`,
  `Generate a post about free tools for automating social media posting.`,
  `Write an article about how to build an audience with free platforms only.`
];

const chosenPrompt = prompts[Math.floor(Math.random() * prompts.length)];

const finalPrompt = `
Generate a detailed HTML article between 300 and 400 words using <article>, <h1>, <h2>, and <p> tags.
Make it engaging, SEO-friendly, and well-formatted.
At the very end, add:
<p class="kofi-cta">☕ Support me on <a href="https://ko-fi.com/lumi2024" target="_blank">Ko-Fi</a></p>

Prompt: ${chosenPrompt}
`;

try {
  const result = await model.generateContent(finalPrompt);
  let aiContent = result.response.text().trim();
  aiContent = aiContent.replace(/```html|```/g, "").trim();

  const postsDir = path.join("posts");
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir);

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
