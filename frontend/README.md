# Sriram Cakes & Sweets Shop — Frontend

"Sweetness in Every Celebration" — a React + Vite frontend for a premium
cakes, sweets, savouries, nuts, cookies and bakery e-commerce site, with a
full admin dashboard, an AI shopping assistant, and a data analytics suite.

**This now talks to a real backend** (Express + SQLite, in `/backend` next
to this folder). Run the backend first, then this.

## Quick start

```bash
# 1. Start the backend (in one terminal)
cd backend
npm install
cp .env.example .env
npm run dev
# → listening on http://localhost:8080, auto-seeds the database

# 2. Start the frontend (in another terminal)
cd frontend
npm install
npm run dev
# → open http://localhost:5173
```

If the backend isn't running, most of the site (Home, Products, About,
etc.) still renders using a bundled local snapshot of the catalogue — but
auth, checkout, order tracking, addresses, reviews, custom cake orders,
and the whole admin panel need the backend to actually work.

To build for production:

```bash
npm run build
npm run preview
```

## Demo accounts

- **Customer**: register any account at `/register` — it's created for
  real in the backend's SQLite database (password hashed with bcrypt).
- **Admin** (`/admin/login`): `admin@sriramcakes.in` / `admin123` (seeded
  automatically; change it in `backend/.env` before first run if you want
  different credentials).

## Environment variables

Copy `.env.example` to `.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_REVIEW_URL=
VITE_INSTAGRAM_URL=
VITE_FACEBOOK_URL=
VITE_WHATSAPP_URL=
VITE_GOOGLE_MAPS_URL=
```

`VITE_API_BASE_URL` must point at your running backend. The rest are
optional — they only unlock links (Google Reviews button, social icons,
embedded map) once populated.

## What's implemented

**Customer site**: Home, About, Products (search/filter/sort, tab filters,
grid density toggle), Product Details + related products, Offers, Cart
(persisted client-side), Checkout with saved-address picker, Demo UPI/COD
Payment, Custom Cake order form, Reviews (view + submit), Contact,
Login/Register — all backed by the real API.

**Account area**: Order History, Order Tracking (step-by-step status
timeline with timestamps), Saved Addresses (add/edit/delete/set default),
an account dropdown in the navbar, and toast notifications on add-to-cart.

**Admin panel** (`/admin/*`): Dashboard KPIs, Product Management, Category
Management, Order Management (status updates that instantly reflect in
the customer's tracking page), Review Management, and a full Analytics
dashboard — all computed from real data in the backend, not mock numbers.

**AI Shopping Assistant**: a floating "Ask Sriram AI" chat widget. It's a
local, rule-based recommendation engine (`src/services/recommendationEngine.js`)
that runs against a bundled product snapshot — no external AI API is
called, and the UI says so explicitly.

**Design**: cream/maroon/gold "premium Indian bakery" palette, Fraunces +
Karla typography, fixed-background hero, responsive down to 320px.

## How data flows now

`src/services/api.js` is a real HTTP client — every function makes an
actual `fetch()` call to the backend, with JWTs attached automatically
from `localStorage` (`sriram_token` for customers, `sriram_admin_token`
for admin).

`ProductsContext` renders instantly from a bundled local snapshot of the
catalogue (`src/data/products.js`), then fetches the live catalogue from
the backend and swaps it in. If the backend is unreachable, the site keeps
working off the local snapshot instead of breaking — everything else
(auth, orders, addresses, reviews) requires the backend directly and will
show an error toast if it's down.

`src/data/products.js` is also used as-is by the AI chatbot's
recommendation engine, so the assistant keeps working even if the backend
is temporarily down.

## Project structure

```
frontend/
├── public/images/          # Product & category photos (currently placeholders)
├── src/
│   ├── components/         # Reusable UI (Navbar, Sidebar, Footer, cards, AI chat, admin layout, charts)
│   ├── pages/               # Route-level pages (customer + admin)
│   ├── context/             # AuthContext, OrderContext, CartContext, ProductsContext, ToastContext
│   ├── services/            # api.js (real HTTP client), recommendationEngine.js
│   ├── data/                 # products.js — bundled fallback/AI-chatbot catalogue
│   ├── App.jsx, main.jsx, index.css
├── package.json
├── vite.config.js
└── .env.example
```

See `../backend/README.md` for the API reference and database details.
