const fs = require('fs');

const categories = ['Deep Dive', 'Engineering', 'Design', 'Product', 'Community'];
const colors = ['var(--accent-red)', 'var(--accent-purple)', 'var(--accent-blue)', 'var(--accent-green)', 'var(--accent-orange)'];

const blogs = [];

for (let i = 1; i <= 10; i++) {
  const slug = `blog-post-${i}`;
  const title = `Exploring Concept ${i}: The Future of Battery Health`;
  const excerpt = `This is an auto-generated excerpt for blog post number ${i}. We explore various aspects of software engineering and hardware longevity.`;
  const markdownContent = `
# ${title}

This is the full markdown content for **Blog Post ${i}**.

Lithium-ion batteries are chemical engines. They don't like being completely empty, and they absolutely hate being stuffed full to 100% and left on the charger while running heavy workloads.

## The Psychology of Ignoring

When Apple or Microsoft designed their operating systems, they wanted alerts to be "unobtrusive". A tiny little chime, a small gray box sliding in from the right. It's polite.

> "Polite notifications are easily dismissed when you are in a state of deep flow."

But when your battery hits 10% and you're compiling a huge project or rendering a video, you don't need "polite". You need an intervention.

### Bullet points:
- Point 1
- Point 2
- Point 3

\`\`\`javascript
// Some code example
function saveBattery() {
  console.log("Plug it in!");
}
\`\`\`
`;

  fs.writeFileSync(`src/data/markdown/${slug}.md`, markdownContent);

  blogs.push({
    slug,
    title,
    date: `July ${i}, 2026`,
    category: categories[i % categories.length],
    color: colors[i % colors.length],
    excerpt,
    file: `${slug}.md`
  });
}

const tsContent = `
${blogs.map((b, i) => `import content${i} from './markdown/${b.file}?raw';`).join('\n')}

export const blogs = [
  ${blogs.map((b, i) => `{
    slug: "${b.slug}",
    title: "${b.title}",
    date: "${b.date}",
    category: "${b.category}",
    color: "${b.color}",
    excerpt: "${b.excerpt}",
    content: content${i}
  }`).join(',\n')}
];
`;

fs.writeFileSync('src/data/blogs.ts', tsContent);
console.log("Done generating blogs!");
