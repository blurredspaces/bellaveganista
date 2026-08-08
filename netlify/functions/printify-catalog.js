/* ---------------------------------------------------------------------------
   Printify catalogue proxy.

   Returns the shop's published products in the same shape as
   assets/products.json, so shop.html can switch source by changing one
   constant:

       const CATALOGUE_URL = '/.netlify/functions/printify-catalog';

   WHY A PROXY AT ALL
   The Printify token is account-wide — anyone holding it can place orders that
   are billed to the merchant's card. It must never reach the browser, so the
   token stays in this function's environment and the client only ever sees the
   sanitised product list. (The API also does not permit browser CORS calls.)

   SETUP — do this yourself; never paste the token into a chat or commit it.
     1. Printify → Account → Connections → generate a Personal Access Token.
     2. In the Netlify site: Site configuration → Environment variables, add
          PRINTIFY_TOKEN    = <the token>
          PRINTIFY_SHOP_ID  = <numeric shop id>
        Find the shop id by calling https://api.printify.com/v1/shops.json with
        the token, or leave PRINTIFY_SHOP_ID unset and this function will use
        the first shop on the account.
     3. Redeploy.

   Printify's rate limits are 600 req/min globally and 100 req/min on catalogue
   endpoints, so the response is cached for an hour at the edge.

   KNOWN GAP — product links
   Printify has no knowledge of the Wix storefront, so the `slug` below is
   derived from the product title and will NOT always match the real Wix URL
   (several Wix slugs are generic, e.g. "unisex-heavy-cotton-tee"). Before
   switching shop.html to this endpoint, either add a title→Wix-slug lookup
   here, or point PRODUCT_BASE at the category page so links always land
   somewhere valid. assets/products.json already carries the verified slugs and
   is the safer source until that mapping exists.
--------------------------------------------------------------------------- */

const API = 'https://api.printify.com/v1';

// The storefront that actually takes payment. Printify does not process
// customer payments — it bills the merchant — so checkout stays on Wix.
const PRODUCT_BASE = 'https://www.bellaveganista.com/product-page/';

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function categorise(name) {
  if (/supplement|capsules|gummies|vitamin|minerals/i.test(name)) return 'Vitamins';
  if (/tee|sweatshirt|hoodie|hooded|shirt/i.test(name)) return 'Apparel';
  if (/ebook|book/i.test(name)) return 'Ebooks';
  if (/mug|bento|charcuterie|board|bag|bottle/i.test(name)) return 'Home & Kitchen';
  return 'Other';
}

async function printify(path, token) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'bella-veganista-site' },
  });
  if (!res.ok) throw new Error(`Printify ${path} → ${res.status}`);
  return res.json();
}

export async function handler() {
  const token = process.env.PRINTIFY_TOKEN;
  if (!token) {
    return json(500, { error: 'PRINTIFY_TOKEN is not configured' });
  }

  try {
    let shopId = process.env.PRINTIFY_SHOP_ID;
    if (!shopId) {
      const shops = await printify('/shops.json', token);
      if (!shops.length) return json(502, { error: 'No shops on this Printify account' });
      shopId = shops[0].id;
    }

    const page = await printify(`/shops/${shopId}/products.json?limit=100`, token);

    const products = (page.data || [])
      .filter((p) => p.visible !== false)
      .map((p) => {
        // Cheapest enabled variant is what a storefront shows as "from" price.
        const enabled = (p.variants || []).filter((v) => v.is_enabled);
        const cents = enabled.length ? Math.min(...enabled.map((v) => v.price)) : null;
        const image = (p.images || []).find((i) => i.is_default) || (p.images || [])[0];

        return {
          name: p.title,
          price: cents == null ? '' : `$${(cents / 100).toFixed(2)}`,
          slug: slugify(p.title),
          image: image ? image.src : '',
          cat: categorise(p.title),
        };
      })
      .filter((p) => p.price);

    return json(
      200,
      {
        source: 'printify',
        captured: new Date().toISOString().slice(0, 10),
        productBase: PRODUCT_BASE,
        // Printify returns absolute image URLs, so no media transform is needed.
        mediaBase: '',
        mediaTransform: '',
        products,
      },
      { 'Cache-Control': 'public, max-age=0, s-maxage=3600' }
    );
  } catch (err) {
    return json(502, { error: String(err.message || err) });
  }
}

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(body),
  };
}
