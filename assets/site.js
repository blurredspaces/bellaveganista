/* Bella Veganista — shared header & footer.
   Both render synchronously during parse (insertAdjacentHTML on the currently
   executing script), so there is no flash of unstyled or missing chrome. */

const LOGO = 'assets/logo%20bella%20veganista.png';

const NAV = [
  { id: 'recipes', label: 'Recipes', href: 'recipes.html' },
  { id: 'about', label: 'About', href: 'about.html' },
  { id: 'shop', label: 'Shop', href: 'shop.html' },
  { id: 'newsletter', label: 'Newsletter', href: 'newsletter.html' },
];

const ICONS = {
  instagram:
    '<path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.5.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.4 1-.9 1.4-.4.5-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.4-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.2.8-.4.3-.6.7-.8 1.2-.2.4-.4 1-.4 2.1C2.7 9.7 2.7 10.1 2.7 12s0 2.3.07 3.5c.05 1.1.24 1.7.4 2.1.2.5.44.9.8 1.2.3.4.7.6 1.2.8.4.2 1 .4 2.1.4 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.44 1.2-.8.4-.3.6-.7.8-1.2.2-.4.4-1 .4-2.1.07-1.2.07-1.6.07-3.5s0-2.3-.07-3.5c-.05-1.1-.24-1.7-.4-2.1-.2-.5-.44-.9-.8-1.2-.3-.4-.7-.6-1.2-.8-.4-.2-1-.4-2.1-.4C15.5 4 15.1 4 12 4z"/><path d="M12 15.4a3.4 3.4 0 110-6.8 3.4 3.4 0 010 6.8zm0-8.6a5.2 5.2 0 100 10.4 5.2 5.2 0 000-10.4z"/><circle cx="17.4" cy="6.6" r="1.2"/>',
  pinterest:
    '<path d="M12 2.2A9.8 9.8 0 008.4 21.1a9.4 9.4 0 01.07-2.8c.16-.7 1.05-4.5 1.05-4.5a3.4 3.4 0 01-.28-1.4c0-1.32.76-2.3 1.72-2.3.8 0 1.2.6 1.2 1.34 0 .82-.52 2.04-.8 3.18-.22.95.48 1.73 1.42 1.73 1.7 0 3-1.8 3-4.4 0-2.3-1.65-3.9-4-3.9a4.15 4.15 0 00-4.33 4.16c0 .83.32 1.72.72 2.2a.29.29 0 01.07.28l-.27 1.1c-.04.18-.14.22-.33.13-1.23-.57-2-2.37-2-3.82 0-3.1 2.25-5.95 6.5-5.95 3.41 0 6.06 2.43 6.06 5.68 0 3.39-2.13 6.11-5.1 6.11-1 0-1.93-.52-2.25-1.13l-.61 2.34a11 11 0 01-1.23 2.58A9.8 9.8 0 1012 2.2z"/>',
  facebook:
    '<path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0022 12z"/>',
  youtube:
    '<path d="M21.6 7.2a2.5 2.5 0 00-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.83.43A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.77 1.77C5.75 19 12 19 12 19s6.25 0 7.83-.43a2.5 2.5 0 001.77-1.77A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15.02V8.98L15.2 12 10 15.02z"/>',
};

function socialRow(size = 17, cls = 'gap-4') {
  return `<div class="flex items-center ${cls}">
    ${Object.entries(ICONS)
      .map(
        ([name, path]) =>
          `<a class="social-ico" href="#" aria-label="${name[0].toUpperCase() + name.slice(1)}">
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${path}</svg>
      </a>`
      )
      .join('')}
  </div>`;
}

function renderHeader(active) {
  const links = NAV.map(
    (n) =>
      `<a class="nav-link" href="${n.href}"${
        n.id === active ? ' aria-current="page"' : ''
      }>${n.label}</a>`
  ).join('');

  const html = `
  <div class="pattern-strip" aria-hidden="true"></div>

  <header class="bg-cream border-b border-rule">
    <div class="max-w-shell mx-auto px-5 sm:px-8">

      <!-- utility row -->
      <div class="flex items-center justify-between gap-4 py-4 lg:justify-center lg:gap-7">

        <button id="navToggle" class="lg:hidden -ml-1 p-2 text-ink hover:text-berry transition-colors"
                aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18"/>
          </svg>
        </button>

        <nav class="hidden lg:flex items-center gap-7" aria-label="Primary">${links}</nav>

        <form class="hidden lg:block relative" role="search" onsubmit="return false;">
          <label for="hdrSearch" class="sr-only">Search recipes</label>
          <input id="hdrSearch" type="search" placeholder="SEARCH" class="field w-40 py-1.5 pl-3 pr-8"/>
          <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" width="13" height="13"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
          </svg>
        </form>

        ${socialRow(17, 'gap-4')}
      </div>

      <!-- mobile drawer -->
      <nav id="mobileNav" class="hidden lg:hidden pb-5 border-t border-rule pt-4" aria-label="Mobile">
        <div class="flex flex-col gap-4">${links}</div>
        <form class="relative mt-5" role="search" onsubmit="return false;">
          <label for="mobSearch" class="sr-only">Search recipes</label>
          <input id="mobSearch" type="search" placeholder="SEARCH" class="field w-full py-2 pl-3 pr-9"/>
        </form>
      </nav>

      <!-- wordmark -->
      <div class="flex justify-center pb-7 pt-3">
        <a href="index.html" class="block transition-transform duration-500 hover:scale-[1.03] active:scale-100"
           style="transition-timing-function:var(--spring)" aria-label="Bella Veganista — home">
          <img src="${LOGO}" alt="Bella Veganista" class="logo-img h-28 sm:h-36 w-auto"/>
        </a>
      </div>
    </div>
  </header>`;

  document.currentScript.insertAdjacentHTML('beforebegin', html);
}

function renderFooter() {
  const col = (title, items) =>
    `<div>
      <h3 class="eyebrow text-sage-dp mb-4">${title}</h3>
      <ul class="space-y-2.5">
        ${items.map((i) => `<li><a class="qlink" href="${i[1]}">${i[0]}</a></li>`).join('')}
      </ul>
    </div>`;

  const html = `
  <footer class="mt-[var(--s7)] border-t border-rule bg-shell">
    <div class="max-w-shell mx-auto px-5 sm:px-8 py-[var(--s6)]">
      <div class="grid gap-[var(--s5)] md:grid-cols-[1.4fr_1fr_1fr_1fr]">

        <div>
          <img src="${LOGO}" alt="Bella Veganista" class="logo-img h-24 w-auto mb-5 -ml-2"/>
          <p class="text-[0.95rem] text-muted max-w-xs">
            Plant-based recipes made with compassion, colour and a whole lot of flavour.
          </p>
          <div class="mt-5">${socialRow(18, 'gap-4')}</div>
        </div>

        ${col('Explore', [
          ['All Recipes', 'recipes.html'],
          ['About DeAna', 'about.html'],
          ['Shop', 'shop.html'],
          ['Newsletter', 'newsletter.html'],
        ])}
        ${col('Recipes', [
          ['Breakfast', 'recipes.html'],
          ['Mains', 'recipes.html'],
          ['Soups & Stews', 'recipes.html'],
          ['Desserts', 'recipes.html'],
        ])}
        ${col('More', [
          ['Contact', '#'],
          ['Privacy Policy', '#'],
          ['Accessibility', '#'],
          ['Work With Me', '#'],
        ])}
      </div>

      <div class="ornament my-[var(--s5)] text-rule" aria-hidden="true">
        <svg width="34" height="9" viewBox="0 0 34 9" fill="none" stroke="var(--sage)" stroke-width="1">
          <path d="M1 4.5h10M23 4.5h10"/><path d="M17 1l3 3.5-3 3.5-3-3.5z" fill="var(--sage)" stroke="none"/>
        </svg>
      </div>

      <p class="text-center text-[0.8rem] text-muted font-ui tracking-wide">
        © ${new Date().getFullYear()} Bella Veganista · Plant-Based. Health. Wellness.
      </p>
    </div>
  </footer>`;

  document.currentScript.insertAdjacentHTML('beforebegin', html);
}

/* The standard "welcome" sidebar used on About, Shop and Newsletter.
   Pass { photo: false } where the page already leads with DeAna's portrait. */
function renderSidebar({ photo = true } = {}) {
  const cats = [
    ['Breakfast', 'Mains'],
    ['Desserts', 'Smoothies'],
    ['Gluten Free', 'Soups'],
  ];

  const html = `
  <aside class="lg:border-l lg:border-rule lg:pl-[var(--s5)]">
    <div class="sidebar-inner space-y-[var(--s5)]">

      <p class="display text-center text-[1.35rem] leading-snug">
        A plant-based blog with bold, healing recipes.
      </p>

      <div class="border-t border-rule pt-[var(--s5)] text-center">
        <h2 class="hollow text-[1.35rem] mb-5">Search Recipes</h2>
        <div class="space-y-2">
          ${cats
            .map(
              (row) =>
                `<div class="flex justify-center items-center gap-2 text-muted">
                  <a class="qlink" href="recipes.html">${row[0]}</a><span>/</span>
                  <a class="qlink" href="recipes.html">${row[1]}</a>
                </div>`
            )
            .join('')}
        </div>
        <a class="tlink mt-5" href="recipes.html">All Recipes <span aria-hidden="true">»</span></a>
      </div>

      <div class="ornament text-ink" aria-hidden="true">
        <svg width="34" height="9" viewBox="0 0 34 9" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M1 4.5h10M23 4.5h10"/><path d="M17 1l3 3.5-3 3.5-3-3.5z" fill="currentColor" stroke="none"/>
        </svg>
      </div>

      <div class="text-center">
        ${
          photo
            ? `<div class="card-media mb-5">
          <img src="assets/bella%20veganista%20image%20with%20Deana.jpeg" alt="DeAna of Bella Veganista"
               class="w-full aspect-[4/5] object-cover" loading="lazy"/>
        </div>`
            : ''
        }
        <h2 class="display text-[1.2rem] mb-3">Welcome to Bella Veganista!</h2>
        <p class="text-[0.92rem] text-muted leading-relaxed mb-4">
          I'm DeAna. I share plant-based recipes rooted in compassion and comfort —
          the kind of food that heals you and tastes like home.
        </p>
        <a class="ulink text-[0.92rem]" href="about.html">More about DeAna…</a>
      </div>

      <div class="flex justify-center">${socialRow(18, 'gap-5')}</div>

      <a href="shop.html" class="card block bg-sage-dp text-cream text-center px-6 py-8
         transition-transform duration-500 hover:-translate-y-1 active:translate-y-0"
         style="transition-timing-function:var(--spring);box-shadow:var(--shadow-raised)">
        <span class="eyebrow text-peach">Now in the shop</span>
        <span class="display block text-[1.5rem] mt-2 mb-3">Plants Heal Tee</span>
        <span class="tlink text-peach border-peach">Shop now <span aria-hidden="true">→</span></span>
      </a>
    </div>
  </aside>`;

  document.currentScript.insertAdjacentHTML('beforebegin', html);
}

/* Mobile drawer toggle — bound after the header exists in the DOM. */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('navToggle');
  const panel = document.getElementById('mobileNav');
  if (!btn || !panel) return;
  btn.addEventListener('click', () => {
    const open = panel.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
});
