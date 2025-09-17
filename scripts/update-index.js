import fs from 'fs';
import path from 'path';

const postsDir = path.join('posts');
const templateFile = path.join('index-template.html');
const indexFile = path.join('index.html');

const files = fs.readdirSync(postsDir)
  .filter(f => f.endsWith('.html'))
  .sort()
  .reverse();

const listItems = files.map(f => {
  return `        <li><a href="posts/${f}">${f.replace('.html', '')}</a></li>`;
}).join('\n');

let template = fs.readFileSync(templateFile, 'utf-8');
const finalHtml = template.replace('<!-- POSTS_LIST -->', listItems);

fs.writeFileSync(indexFile, finalHtml, 'utf-8');
console.log(`✅ index.html updated with ${files.length} posts.`);
