// Tiny, dependency-free markdown renderer good enough for blog posts.
// Supports: #..###### headings, **bold**, *italic*, `code`, [text](url),
// unordered lists (-), ordered lists (1.), blockquotes (>), --- hr,
// paragraphs and line breaks. Escapes HTML.

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(s: string) {
  let out = esc(s);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(
    /\[([^\]]+)\]\((https?:[^)]+)\)/g,
    '<a href="$2" rel="noopener" target="_blank">$1</a>',
  );
  return out;
}

export function renderMarkdown(md: string): string {
  const lines = (md ?? "").replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      // Demote H1 to H2: the page shell already renders the single page H1,
      // so a markdown "# Title" would create a duplicate H1 (SEO issue).
      const level = Math.min(6, Math.max(2, h[1].length === 1 ? 2 : h[1].length));
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^---+$/.test(line.trim())) { out.push("<hr/>"); i++; continue; }

    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(inline(lines[i].replace(/^>\s?/, "")));
        i++;
      }
      out.push(`<blockquote>${buf.join("<br/>")}</blockquote>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        buf.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ul>${buf.join("")}</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        buf.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ol>${buf.join("")}</ol>`);
      continue;
    }

    // paragraph
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6})\s+/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i]) && !/^>\s?/.test(lines[i]) && !/^---+$/.test(lines[i].trim())) {
      buf.push(inline(lines[i]));
      i++;
    }
    out.push(`<p>${buf.join("<br/>")}</p>`);
  }
  return out.join("\n");
}
