// Sriram AI — local, rule-based shopping-assistant engine.
//
// This is intentionally a local/offline engine (no external LLM key is
// configured anywhere in this project), but it is designed so a future
// backend-proxied call to an LLM could slot in behind `interpretMessage`
// without touching the UI components.
//
// Responsibilities:
//   1. Detect whether the user is writing in Tanglish or English and reply
//      in the same style.
//   2. Understand shopping intent (occasion, category, budget, flavour).
//   3. Keep short-term conversation context (budget/occasion/category/
//      flavour carried across turns) so follow-up answers like "500" or
//      "chocolate" are understood correctly.
//   4. Only ever recommend products that actually exist in the live
//      catalogue passed in — nothing is invented.

// ---------------------------------------------------------------------------
// Language detection
// ---------------------------------------------------------------------------

// Common Tanglish (romanised Tamil) words/particles. Matched as whole
// tokens, not substrings, to avoid false positives inside English words.
const TANGLISH_MARKERS = new Set([
  'enaku', 'enakku', 'unga', 'ungaloda', 'ungalukku', 'namma', 'nammaloda',
  'venum', 'vendum', 'vena', 'venuma', 'venaam', 'vendaam', 'beku',
  'kudunga', 'kudu', 'tharunga', 'pannunga', 'pannu', 'panren', 'panra',
  'panniyum', 'pannalam', 'panna', 'panniten', 'panniruken', 'panuvom',
  'iruka', 'irukka', 'irukku', 'iruku', 'irundha', 'irukkumaa', 'illa',
  'illai', 'illaya', 'aagum', 'aaguma', 'aagumaa', 'epdi', 'eppadi',
  'yepdi', 'evlo', 'evalo', 'evvalo', 'enna', 'yenna', 'ethu', 'edhu',
  'romba', 'konjam', 'konjum', 'seri', 'sari', 'vaanga', 'vaango',
  'poidalam', 'poidungo', 'poranga', 'varen', 'varuvengala', 'nu', 'oda',
  'kaga', 'dhaan', 'thaan', 'pola', 'maadhiri', 'madhiri', 'mattum',
  'kandippa', 'semma', 'nalla', 'sollunga', 'solunga', 'kudukanum', 'na',
  'naa', 'ippo', 'appo', 'adhu', 'idhu', 'enga', 'engayo', 'mudichi',
  'mudinjuduchu', 'kulla', 'anga', 'inga', 'ivlo', 'ivalo', 'oru',
  'vanakkam', 'vanakam', 'da', 'di', 'ya', 'aiyo', 'suma', 'ne', 'nee',
  'pesu', 'pesuviya', 'pesuvinga', 'pesunga', 'pesungale', 'pesuveengala',
  'sollu', 'sollunga', 'tamila', 'tamil', 'tanglish', 'unaku', 'ungaluku',
  'vera', 'ivan', 'ival', 'avan', 'aval', 'ithu', 'athu',
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9\u20b9]+/i)
    .filter(Boolean);
}

/** Returns 'ta' (Tanglish) or 'en' (English). Mixed-language input (the
 *  common case in this shop's chat) is classified as 'ta' so the reply
 *  keeps the same natural mixed flavour the user wrote in. */
export function detectStyle(text) {
  const tokens = tokenize(text);
  const hasTanglish = tokens.some((t) => TANGLISH_MARKERS.has(t));
  return hasTanglish ? 'ta' : 'en';
}

// ---------------------------------------------------------------------------
// Catalogue-aware keyword maps
// ---------------------------------------------------------------------------

const CATEGORY_KEYWORDS = {
  cakes: ['cake', 'cakes', 'pastry'],
  sweets: ['sweet', 'sweets', 'mithai', 'traditional sweet'],
  savouries: ['savoury', 'savory', 'savouries', 'namkeen', 'snack', 'spicy'],
  nuts: ['nut', 'nuts', 'dry fruit', 'dryfruit', 'dry fruits'],
  cookies: ['cookie', 'cookies', 'biscuit'],
  bakery: ['bakery', 'bread', 'puff', 'bun', 'donut'],
  icecreams: ['ice cream', 'icecream', 'ice-cream', 'cone', 'scoop'],
  beverages: ['beverage', 'drink', 'cold drink', 'soda'],
  desserts: ['dessert', 'desserts', 'pudding', 'custard'],
  hampers: ['hamper', 'hampers', 'gift box', 'gift hamper', 'combo'],
};

const CATEGORY_SINGULAR_WORD = {
  cakes: 'cake', sweets: 'sweet', savouries: 'savoury', nuts: 'nut pack',
  cookies: 'cookie pack', bakery: 'bakery item', icecreams: 'ice cream',
  beverages: 'drink', desserts: 'dessert', hampers: 'gift hamper',
};

// occasion -> which categories/tags in the catalogue are relevant
const OCCASION_MAP = {
  birthday: { categories: ['cakes'], tags: ['birthday', 'kids-favourite'] },
  anniversary: { categories: ['cakes', 'desserts'], tags: ['anniversary', 'premium'] },
  wedding: { categories: ['sweets', 'hampers'], tags: ['wedding', 'premium', 'gift'] },
  festival: { categories: ['sweets'], tags: ['festival', 'ghee-sweet', 'syrup-sweet'] },
  gift: { categories: ['hampers', 'sweets', 'nuts'], tags: ['gift', 'premium'] },
  kids: { categories: ['cakes', 'cookies', 'icecreams'], tags: ['kids-favourite'] },
};

const OCCASION_KEYWORDS = {
  birthday: ['birthday', 'bday'],
  anniversary: ['anniversary'],
  wedding: ['wedding', 'marriage'],
  festival: ['festival', 'diwali', 'pongal'],
  gift: ['gift', 'gifting', 'present'],
  kids: ['kids', 'kid', 'children', 'child'],
};

const NEED_MARKERS_EN = ["i need", "i want", "need a", "want a", "i'd like", 'looking for', 'require', 'required'];
const NEED_MARKERS_TA = ['venum', 'vendum', 'vena', 'venuma', 'beku', 'kudunga', 'kudu', 'tharunga', 'kudukanum'];

// "you pick one for me" style asks — should trigger a single, specific
// recommendation rather than re-showing the same list.
const PICK_ONE_REGEX = /\b(select|choose|pick)\b.*\b(one|onnu|for me)\b|\bany one\b|\byou (select|choose|pick)\b|\bsuggest one\b|\bwhich one is best\b|\brecommend one\b|onnu\s*(select|pick)\s*pannu/i;

const GREETING_WORDS = new Set(['hi', 'hello', 'hey', 'vanakkam', 'vanakam', 'hola', 'yo']);
const THANKS_WORDS = ['thanks', 'thank you', 'thank u', 'nandri', 'thx'];
const ACK_WORDS = new Set(['ok', 'okay', 'k', 'fine', 'alright', 'sure', 'seri', 'sari', 'shot', 'right', 'cool']);

const SHOP_GENERIC_WORDS = [
  'cake', 'cakes', 'sweet', 'sweets', 'price', 'order', 'cart', 'checkout',
  'delivery', 'custom', 'gift', 'review', 'shop', 'product', 'products',
  'buy', 'budget', 'discount', 'offer', 'offers', 'contact', 'menu',
  'catalogue', 'catalog', 'stock', 'rs.', 'rupees',
];

const FLAVOR_STOPWORDS = new Set([
  'cake', 'cakes', 'sweet', 'sweets', 'box', 'pack', 'combo', 'hamper',
  'hampers', 'ice', 'cream', 'cookie', 'cookies', 'biscuit', 'bread',
  'bun', 'puff', 'donut', 'drink', 'soda', 'the', 'and', 'with', 'for',
  // Occasion / marketing tags — these describe *when or why* someone is
  // buying, not *what it tastes like*, so they must not be treated as a
  // flavour (otherwise "birthday cake" would wrongly become a "birthday
  // flavoured" filter and produce duplicated wording like "birthday
  // birthday options").
  'birthday', 'anniversary', 'wedding', 'marriage', 'festival', 'gift',
  'gifting', 'present', 'kids', 'kid', 'children', 'child', 'premium',
  'bestseller', 'classic', 'eggless', 'available', 'favourite', 'ghee',
  'syrup',
]);

function buildFlavorIndex(products) {
  const index = new Map(); // keyword -> product[]
  for (const p of products) {
    const words = new Set([
      ...p.name.toLowerCase().split(/\s+/),
      ...(p.tags || []).map((t) => t.toLowerCase().replace(/-/g, ' ')),
    ]);
    for (const w of words) {
      if (w.length < 4 || FLAVOR_STOPWORDS.has(w)) continue;
      if (!index.has(w)) index.set(w, []);
      index.get(w).push(p);
    }
  }
  return index;
}

const FLAVOR_EMOJI = {
  chocolate: '🍫', vanilla: '🍦', butterscotch: '🍯', red: '❤️', velvet: '❤️',
  black: '🍒', forest: '🍒', fruit: '🍓', strawberry: '🍓', mysore: '💛',
  kaju: '💛', pineapple: '🍍', mango: '🥭',
};
function flavorEmoji(flavor) {
  return FLAVOR_EMOJI[flavor] || '😋';
}

// ---------------------------------------------------------------------------
// Entity extraction
// ---------------------------------------------------------------------------

function extractBudget(text) {
  const patterns = [
    /(?:under|below|less than|within)\s*(?:\u20b9|rs\.?|rupees)?\s*(\d{2,6})/i,
    /(\d{2,6})\s*(?:rs\.?|rupees|\u20b9)?\s*kulla\b/i,
    /budget\s*(?:is|:|of)?\s*(?:\u20b9|rs\.?)?\s*(\d{2,6})/i,
    /around\s*(?:\u20b9|rs\.?)?\s*(\d{2,6})/i,
    /about\s*(?:\u20b9|rs\.?)?\s*(\d{2,6})/i,
    /(?:\u20b9|rs\.?)\s*(\d{2,6})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return Number(m[1]);
  }
  return null;
}

// A message that is *just* a number ("500") — used to resolve a pending
// "what's your budget?" question.
function extractBareNumber(text) {
  const m = text.trim().match(/^(?:rs\.?|\u20b9)?\s*(\d{2,6})\s*(?:rs\.?|rupees|\u20b9)?$/i);
  return m ? Number(m[1]) : null;
}

function extractCategory(text) {
  for (const [catId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return catId;
  }
  return null;
}

function extractOccasion(text) {
  for (const [occ, keywords] of Object.entries(OCCASION_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return occ;
  }
  return null;
}

function extractFlavor(text, flavorIndex) {
  for (const key of flavorIndex.keys()) {
    if (text.includes(key)) return key;
  }
  return null;
}

function hasNeedMarker(text, tokens) {
  if (NEED_MARKERS_EN.some((m) => text.includes(m))) return true;
  return NEED_MARKERS_TA.some((m) => tokens.includes(m));
}

function isGreeting(tokens) {
  return tokens.length <= 3 && tokens.some((t) => GREETING_WORDS.has(t));
}

function isThanks(text) {
  return THANKS_WORDS.some((w) => text.includes(w));
}

function isAcknowledgement(tokens) {
  return tokens.length <= 2 && tokens.every((t) => ACK_WORDS.has(t));
}

function isShopRelated(text, flavorIndex) {
  if (SHOP_GENERIC_WORDS.some((w) => text.includes(w))) return true;
  if (Object.values(CATEGORY_KEYWORDS).some((arr) => arr.some((k) => text.includes(k)))) return true;
  if (Object.values(OCCASION_KEYWORDS).some((arr) => arr.some((k) => text.includes(k)))) return true;
  for (const key of flavorIndex.keys()) {
    if (text.includes(key)) return true;
  }
  return false;
}

// Help / navigation intents
function matchHelpIntent(text) {
  if (/how (do i|to|can i)\s*(order|buy|checkout)|order pandrathu|order panna epdi|checkout epdi/.test(text)) {
    return 'how_to_order';
  }
  if (/order status|track (my )?order|order.*status.*check|order engeyachu/.test(text)) {
    return 'order_status';
  }
  if (/custom(ise|ize)?\s*cake|design.*cake|cake.*design/.test(text)) {
    return 'custom_cake';
  }
  if (/contact|phone number|reach (you|the shop)|shop.*address/.test(text)) {
    return 'contact';
  }
  return null;
}

// ---------------------------------------------------------------------------
// Catalogue filtering
// ---------------------------------------------------------------------------

function applyFilters(products, { category, occasion, budget, flavor }) {
  let list = [...products];
  if (occasion && OCCASION_MAP[occasion]) {
    const map = OCCASION_MAP[occasion];
    list = list.filter(
      (p) => map.categories.includes(p.category) || (p.tags || []).some((t) => map.tags.includes(t))
    );
  }
  if (category) list = list.filter((p) => p.category === category);
  if (budget) list = list.filter((p) => p.finalPrice <= budget);
  if (flavor) {
    list = list.filter(
      (p) => p.name.toLowerCase().includes(flavor) || (p.tags || []).some((t) => t.replace('-', ' ').includes(flavor))
    );
  }
  return list;
}

// Progressively drops the least important filter (flavour, then budget,
// then category, then occasion) until something matches, so the user is
// never shown a hard dead end.
function smartFilter(products, filters) {
  const order = ['flavor', 'budget', 'category', 'occasion'];
  let current = { ...filters };
  let result = applyFilters(products, current);
  const relaxed = [];

  for (const key of order) {
    if (result.length > 0) break;
    if (current[key]) {
      relaxed.push(key);
      current = { ...current, [key]: null };
      result = applyFilters(products, current);
    }
  }
  if (result.length === 0 && products.length > 0) {
    result = products;
    relaxed.push('all');
  }

  return {
    result: [...result].sort((a, b) => b.rating - a.rating).slice(0, 4),
    relaxed,
  };
}

function categoryLabelFor(categoryId, categories) {
  if (!categoryId) return null;
  const found = categories?.find((c) => c.id === categoryId);
  if (found) return found.name;
  return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
}

function topNames(list, n = 2) {
  const names = list.slice(0, n).map((p) => p.name);
  if (names.length === 0) return null;
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

// ---------------------------------------------------------------------------
// Conversation context
// ---------------------------------------------------------------------------

export function createInitialContext() {
  return { occasion: null, category: null, budget: null, flavor: null, awaiting: null, lastStyle: null };
}

function resolveStyle(text, tokens, ctx) {
  const detected = detectStyle(text);
  // A short, ambiguous reply ("500", "chocolate") carries no language
  // signal of its own — keep replying in whatever style the conversation
  // was already using instead of snapping back to English.
  if (detected === 'en' && tokens.length <= 2 && ctx.lastStyle === 'ta') return 'ta';
  return detected;
}

function occasionCategoryLabel(occasion, category, categories) {
  const word = CATEGORY_SINGULAR_WORD[category];
  if (occasion && word) return `${occasion} ${word}`;
  if (occasion) return occasion;
  return categoryLabelFor(category, categories);
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Interprets one user message given the running conversation context and
 * the live product catalogue, and returns a reply + products + the updated
 * context to carry into the next turn.
 *
 * @param {object} params
 * @param {string} params.text - raw user message
 * @param {object} params.context - previous context (see createInitialContext)
 * @param {object[]} params.products - live catalogue (from the backend)
 * @param {object[]} params.categories - live categories (from the backend)
 */
export function interpretMessage({ text, context, products, categories }) {
  const ctxIn = context || createInitialContext();
  const list = products || [];
  const cats = categories || [];

  const style = resolveStyle(text, tokenize(text), ctxIn);
  const q = text.toLowerCase().trim();
  const tokens = tokenize(q);
  const flavorIndex = buildFlavorIndex(list);
  const ctx = { ...ctxIn, lastStyle: style };

  const reply = (ta, en) => ({ reply: style === 'ta' ? ta : en, products: [], context: ctx, style });
  const replyWithProducts = (ta, en, items) => ({ reply: style === 'ta' ? ta : en, products: items, context: ctx, style });

  // ---- 1. Greetings & thanks (always short-circuit) ----
  if (isGreeting(tokens)) {
    return reply(
      'Vanakkam! 👋 Sriram Cakes & Sweets-ku welcome! Eppadi help pannattum? 🎂🍬',
      'Hi! 👋 Welcome to Sriram Cakes & Sweets! How can I help you today? 🎂🍬'
    );
  }
  if (isThanks(q)) {
    return reply('Welcome! 😊 Vera edhavadhu help venumna sollunga.', "You're welcome! 😊 Let me know if you need anything else.");
  }
  if (isAcknowledgement(tokens) && !ctx.occasion && !ctx.category && !ctx.budget && !ctx.flavor) {
    return reply(
      'Super! 😊 Edhavadhu cake, sweet venumnu sollunga, help panren!',
      "Great! 😊 Let me know if you'd like a cake or sweet recommendation anytime."
    );
  }

  // ---- 1b. "Can you speak Tamil/Tanglish?" — answer the meta-question
  //          directly instead of the generic out-of-scope redirect. ----
  if (/tamil|tanglish/.test(q) && /(pesu|speak|sollu|pes)/.test(q)) {
    return reply(
      'Aamaam! 😊 Naan Tanglish-um English-um pesuven. Cakes, sweets pathi enna venumnu kelunga!',
      'Yes! 😊 I can chat in both English and Tanglish. Ask me anything about our cakes and sweets!'
    );
  }

  // ---- 2. Navigation / help intents ----
  const helpIntent = matchHelpIntent(q);
  if (helpIntent === 'how_to_order') {
    return reply(
      'Product-a select panni cart-la add pannunga 🛒. Apram checkout-ku poi order complete pannalam.',
      'Choose a product, add it to your cart, proceed to checkout, and complete your order. 🛒'
    );
  }
  if (helpIntent === 'order_status') {
    return reply(
      'Account-la poi Order History section open pannunga. Anga unga order status check pannalam. 😊',
      'Go to your Account → Order History to check your order status. 😊'
    );
  }
  if (helpIntent === 'custom_cake') {
    return reply(
      'Custom cake venumna Custom Cake section-ku pogalam 🎂. Anga unga design, flavour, size, message details kuduthu request submit pannalam.',
      'For a customized cake, open the Custom Cake section 🎂 and share your preferred design, flavour, size, and message.'
    );
  }
  if (helpIntent === 'contact') {
    return reply(
      'Contact page mulama namma-la reach pannalam 📞. Edhavadhu kelvi irundha kelunga!',
      "You can reach us through the Contact page — we're happy to help! 📞"
    );
  }

  // ---- 3. Direct catalogue intents (bypass context) ----
  if (/best rated|top rated|highest rated/.test(q)) {
    const top = [...list].sort((a, b) => b.rating - a.rating).slice(0, 4);
    return replyWithProducts(
      'Ippo namma shop-la best rating vachirukkura products ithu:',
      'Here are our highest-rated products right now:',
      top
    );
  }
  if (/offer|discount|deal/.test(q)) {
    const top = [...list].filter((p) => p.discount > 0).sort((a, b) => b.discount - a.discount).slice(0, 4);
    return replyWithProducts("Indha naaliku best offers ithu:", "Here are today's best offers:", top);
  }
  const priceMatch = q.match(/price of (.+)/) || q.match(/how much (?:is|does) (.+?)(?:\s*cost)?\??$/);
  if (priceMatch) {
    const name = priceMatch[1].trim();
    const found = list.find((p) => p.name.toLowerCase().includes(name));
    if (found) {
      const discountSuffix = found.discount > 0 ? ` (${found.discount}% off \u20b9${found.originalPrice})` : '';
      return replyWithProducts(
        `${found.name} price \u20b9${found.finalPrice}${discountSuffix} thaan.`,
        `${found.name} is priced at \u20b9${found.finalPrice}${discountSuffix}.`,
        [found]
      );
    }
  }

  // ---- 4. Extract entities from this message ----
  const budgetFromText = extractBudget(q);
  const bareNumber = extractBareNumber(q);
  const occasionFromText = extractOccasion(q);
  const categoryFromText = extractCategory(q);
  const flavorFromText = extractFlavor(q, flavorIndex);
  const needMarker = hasNeedMarker(q, tokens);
  const hasNewSignal = Boolean(occasionFromText || categoryFromText || flavorFromText || budgetFromText || bareNumber);
  const wasAwaiting = ctx.awaiting !== null;

  // "You pick one for me" — recommend a single specific product instead of
  // repeating whatever list was already shown.
  if (PICK_ONE_REGEX.test(q)) {
    const { result: picked } = smartFilter(list, {
      category: ctx.category,
      occasion: ctx.occasion,
      budget: ctx.budget,
      flavor: ctx.flavor,
    });
    const top = picked[0];
    if (top) {
      return replyWithProducts(
        `Enakku pudicha pick ithu: ${top.name} 😋 (${top.rating}★, ₹${top.finalPrice}). Cart-la add pannalama?`,
        `I'd go with ${top.name} 😋 — it's rated ${top.rating}★ at ₹${top.finalPrice}. Want to add it to your cart?`,
        [top]
      );
    }
  }

  // ---- 5. Resolve a pending question from the previous turn ----
  if (ctx.awaiting === 'occasion_budget' || ctx.awaiting === 'budget') {
    if (occasionFromText) ctx.occasion = occasionFromText;
    if (categoryFromText) ctx.category = categoryFromText;
    if (flavorFromText) ctx.flavor = flavorFromText;
    if (budgetFromText) ctx.budget = budgetFromText;
    else if (bareNumber) ctx.budget = bareNumber;

    if (!ctx.budget && ctx.awaiting === 'occasion_budget' && !ctx.occasion) {
      return reply(
        'Sorry, purinjudhu illa 😅 Konjam clear-a sollunga — enna occasion, evlo budget?',
        "Sorry, I didn't quite catch that 😅 Could you tell me the occasion and your budget?"
      );
    }
    if (!ctx.budget) {
      ctx.awaiting = 'budget';
      const occCap = ctx.occasion ? ctx.occasion.charAt(0).toUpperCase() + ctx.occasion.slice(1) : null;
      return reply(
        `Sure! 🎂 ${occCap ? occCap + '-ku' : 'Andha'} help pannuren. Unga budget evlo?`,
        `Got it! What's your budget?`
      );
    }
    ctx.awaiting = null;
  } else {
    if (occasionFromText) ctx.occasion = occasionFromText;
    if (categoryFromText) ctx.category = categoryFromText;
    if (flavorFromText) ctx.flavor = flavorFromText;
    if (budgetFromText) ctx.budget = budgetFromText;
  }

  // ---- 6. Decide: ask a clarifying question, or show results? ----
  const stillNeedsInfo = needMarker && !ctx.budget && ctx.awaiting === null;
  if (stillNeedsInfo) {
    const word = CATEGORY_SINGULAR_WORD[ctx.category] || 'item';
    if (!ctx.occasion) {
      ctx.awaiting = 'occasion_budget';
      return reply(
        'Sure! 🎂 Birthday-kku, anniversary-kku illa vera edhavadhu occasion-kku-nu solunga. Adhoda budget evlo-nu sollunga.',
        "Sure! 🎂 Is it for a birthday, anniversary, or another occasion? And what's your budget?"
      );
    }
    ctx.awaiting = 'budget';
    const occCap = ctx.occasion.charAt(0).toUpperCase() + ctx.occasion.slice(1);
    return reply(
      `Kandippa! 🎂 ${occCap}-ku ${word} choose panna help panren. Unga budget evlo?`,
      `Sure! I can help you find a ${word} for your ${ctx.occasion}. What's your budget?`
    );
  }

  // ---- 7. If there's leftover context but this message adds nothing new
  //         and wasn't answering a pending question, don't just repeat the
  //         same result set — nudge the user instead.
  const hasAnyContext = ctx.occasion || ctx.category || ctx.budget || ctx.flavor;
  if (hasAnyContext && !hasNewSignal && !wasAwaiting) {
    return reply(
      "Mela irukkura options-la edhachum pidikkuma? 😊 'Add' click pannunga, illa unga budget/flavor sollunga innum thedi tharen.",
      "Take a look at the options above — tap 'Add' to pick one, or tell me your budget or flavour preference for more choices. 😊"
    );
  }

  // ---- 8. If nothing shop-related was found at all, and there's no
  //         context to fall back on, treat this as out of scope. ----
  if (!hasAnyContext && !isShopRelated(q, flavorIndex)) {
    return reply(
      'Naan Sriram AI, cakes, sweets, orders, shopping related help mattum thaan panren 😊. Sriram Cakes & Sweets-ku eppadi help pannattum?',
      "I'm Sriram AI, so I mainly help with cakes, sweets, orders, and shopping. 😊 How can I help you with Sriram Cakes & Sweets?"
    );
  }

  // ---- 9. Produce a result set from whatever context we have ----
  if (hasAnyContext) {
    const { result, relaxed } = smartFilter(list, {
      category: ctx.category,
      occasion: ctx.occasion,
      budget: ctx.budget,
      flavor: ctx.flavor,
    });
    const categoryLabel = categoryLabelFor(ctx.category || OCCASION_MAP[ctx.occasion]?.categories?.[0], cats);
    const label = occasionCategoryLabel(ctx.occasion, ctx.category, cats) || categoryLabel || 'product';

    ctx.awaiting = null;

    if (relaxed.includes('budget') && ctx.budget) {
      return replyWithProducts(
        `Sorry 😊 \u20b9${ctx.budget} kulla exact match kidaikkala. Konjam affordable options inga irukku, try pannunga:`,
        `Sorry 😊 I couldn't find anything within \u20b9${ctx.budget} — here are our closest affordable options instead:`,
        result
      );
    }

    if (ctx.flavor && ctx.budget && relaxed.length === 0) {
      return replyWithProducts(
        `Sure! ${flavorEmoji(ctx.flavor)} \u20b9${ctx.budget} kulla ${ctx.flavor} ${label} options-a suggest panren.`,
        `Great! ${flavorEmoji(ctx.flavor)} Here are some ${ctx.flavor} ${label} options within \u20b9${ctx.budget}.`,
        result
      );
    }

    if (ctx.budget && relaxed.length === 0) {
      if (ctx.occasion === 'gift') {
        return replyWithProducts(
          `Super! 👍 \u20b9${ctx.budget} kulla gift options-a show panren.`,
          `Great! Here are some gifting options around \u20b9${ctx.budget}.`,
          result
        );
      }
      return replyWithProducts(
        `Super! 👍 \u20b9${ctx.budget} kulla ${label} options-a show panren.`,
        `Great! Here are some ${label} options within \u20b9${ctx.budget}.`,
        result
      );
    }

    if (ctx.budget && !ctx.occasion && !ctx.category) {
      return replyWithProducts(
        `\u20b9${ctx.budget} kulla available-a irukkura options inga irukku 😊`,
        `Here are some great picks under \u20b9${ctx.budget}:`,
        result
      );
    }

    if (ctx.occasion && ctx.category && !ctx.budget) {
      const names = topNames(result) || 'a few of our specials';
      const plural = result.length > 1;
      return replyWithProducts(
        `${ctx.occasion.charAt(0).toUpperCase() + ctx.occasion.slice(1)}-ku ${names} nalla choice${plural ? 's' : ''}. 🎁 Budget sonna innum specific-a suggest pannuven.`,
        `For ${ctx.occasion === 'gift' ? 'gifting' : ctx.occasion}, ${names} ${plural ? 'are great options' : 'is a great option'}. 🎁 I can also show you options based on your budget.`,
        result
      );
    }

    if (ctx.occasion && !ctx.budget) {
      return replyWithProducts(
        `${ctx.occasion.charAt(0).toUpperCase() + ctx.occasion.slice(1)}-ku ithu maadhiri try pannalam:`,
        `Here's what I'd suggest for a ${ctx.occasion}:`,
        result
      );
    }

    if (ctx.category && !ctx.occasion && !ctx.budget) {
      return replyWithProducts(
        `${categoryLabel}-la irukkura popular options ithu:`,
        `Here are our popular picks from ${categoryLabel}:`,
        result
      );
    }

    if (ctx.flavor) {
      return replyWithProducts(
        `"${ctx.flavor}" related-a ithu kidachudhu:`,
        `Here's what I found for "${ctx.flavor}":`,
        result
      );
    }
  }

  // ---- 9. Generic free-text search fallback ----
  const searched = list
    .map((p) => {
      let score = 0;
      if (q.includes(p.name.toLowerCase())) score += 10;
      if ((p.tags || []).some((t) => q.includes(t.replace('-', ' ')))) score += 4;
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((r) => r.p);

  if (searched.length > 0) {
    ctx.awaiting = null;
    return replyWithProducts('Ungalukku ithu match aagudhu:', "Here's what I found for you:", searched);
  }

  // ---- 10. Nothing matched at all ----
  return reply(
    'Sorry 😅, purinjudhu illa. "birthday cake venum", "500 kulla cakes" madhiri kelunga.',
    'I couldn\'t quite match that to a product. Try asking things like "suggest a birthday cake", "show cakes under \u20b9500", or "what\'s the price of Kaju Katli?"'
  );
}
