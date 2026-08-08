/* Shared post loading + a minimal Markdown renderer.
   Content comes from assets/posts.json, which Decap CMS writes at /admin/. */

const POSTS_URL = 'assets/posts.json';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  // "2026-07-12" parses as UTC midnight, which renders as the previous day in
  // any timezone behind UTC. Build a local date from the parts instead.
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  const d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(iso);
  if (isNaN(d)) return iso || '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* Newest first, so DeAna never has to reorder entries by hand in the CMS. */
async function loadPosts() {
  const res = await fetch(POSTS_URL, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`posts.json returned ${res.status}`);
  const data = await res.json();
  return (data.posts || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

/* ---------------------------------------------------------------------------
   Markdown → HTML.

   Deliberately small: it covers what the CMS's markdown widget produces for
   this blog (headings, bold/italic, links, lists, quotes, paragraphs) without
   pulling in a parser library. Input is escaped before any markup is added, so
   raw HTML in a post is rendered as text rather than executed.
--------------------------------------------------------------------------- */
function markdown(src) {
  const blocks = esc(src || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/);

  // Links first, so emphasis inside a label still formats correctly.
  // Only http(s) and root-relative targets are allowed — this blocks
  // javascript: URLs smuggled in through a post body.
  const linkify = (t) =>
    t.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
      (_, label, href) => `<a class="ulink" href="${href}" rel="noopener">${label}</a>`
    );

  const emphasise = (t) =>
    t
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

  const fmt = (t) => emphasise(linkify(t));

  return blocks
    .map((block) => {
      const b = block.trim();
      if (!b) return '';

      const h = b.match(/^(#{1,4})\s+(.*)$/);
      if (h) {
        const level = h[1].length + 1; // "#" is the page title, so start at h2
        const size = { 2: '1.7rem', 3: '1.35rem', 4: '1.15rem', 5: '1.05rem' }[level] || '1.05rem';
        return `<h${level} class="display text-[${size}] mt-[var(--s5)] mb-4">${fmt(h[2])}</h${level}>`;
      }

      // Escaping runs first, so a quote marker arrives here as "&gt;".
      if (/^&gt;\s+/.test(b)) {
        const quote = b.replace(/^&gt;\s?/gm, '');
        return `<blockquote class="border-l-2 border-sage pl-5 my-[var(--s4)] italic text-muted">${fmt(quote)}</blockquote>`;
      }

      if (/^[-*]\s+/m.test(b) && b.split('\n').every((l) => /^[-*]\s+/.test(l.trim()))) {
        const items = b
          .split('\n')
          .map((l) => `<li>${fmt(l.replace(/^\s*[-*]\s+/, ''))}</li>`)
          .join('');
        return `<ul class="list-disc pl-6 space-y-2 mb-[var(--s3)]">${items}</ul>`;
      }

      if (/^\d+\.\s+/m.test(b) && b.split('\n').every((l) => /^\d+\.\s+/.test(l.trim()))) {
        const items = b
          .split('\n')
          .map((l) => `<li>${fmt(l.replace(/^\s*\d+\.\s+/, ''))}</li>`)
          .join('');
        return `<ol class="list-decimal pl-6 space-y-2 mb-[var(--s3)]">${items}</ol>`;
      }

      return `<p>${fmt(b.replace(/\n/g, '<br/>'))}</p>`;
    })
    .join('\n');
}
