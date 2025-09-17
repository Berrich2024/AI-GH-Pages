import fs from 'fs';
import path from 'path';

const postsDir = path.join('posts');
const templateFile = path.join('index-template.html');
const indexFile = path.join('index.html');

// Lire tous les fichiers HTML dans /posts
const files = fs.readdirSync(postsDir)
  .filter(f => f.endsWith('.html'))
  .sort()
  .reverse(); // plus récent en haut

// Générer les <li> pour chaque post
const listItems = files.map(f => {
  const date = f.replace('.html', '');
  return `        <li><a href="posts/${f}">${date}</a></li>`;
}).join('\n');

// Lire template
let template = fs.readFileSync(templateFile, 'utf-8');

// Remplacer le placeholder
const finalHtml = template.replace('<!-- POSTS_LIST -->', listItems);

// Écrire index.html
fs.writeFileSync(indexFile, finalHtml, 'utf-8');
console.log(`✅ index.html updated with ${files.length} posts.`);
