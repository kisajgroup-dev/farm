# Architecture

## 1. Overview

A single Next.js 15 (App Router) application serves **three surfaces**:

1. **Coming Soon page** (public, Phase 1)
2. **Customer website** (public, Phase 2 — home, products, gallery, blog, contact)
3. **Admin Portal** (private, `/admin`)

A single boolean, `Setting.comingSoonMode`, decides which public surface visitors see.

```
if comingSoonMode === true  ->  <ComingSoonPage/>
else                        ->  <HomePage/> (full website)
```

This lives in `src/app/page.tsx`. The `(site)` route group additionally redirects to `/`
while Coming Soon mode is ON, so shop/farm pages stay hidden until launch.

## 2. Folder structure

```
src/
├─ app/
│  ├─ layout.tsx            # root layout, fonts, LanguageProvider
│  ├─ page.tsx              # MODE GATE: coming soon vs full home
│  ├─ globals.css           # Tailwind v4 theme tokens (green organic palette)
│  ├─ (site)/               # customer pages — hidden while Coming Soon is ON
│  │  ├─ layout.tsx         # navbar + footer, redirect guard
│  │  ├─ about/ products/ gallery/ blog/ contact/
│  └─ admin/                # admin portal (protected by middleware)
│     ├─ login/  layout.tsx (sidebar shell)
│     ├─ page.tsx (dashboard)
│     ├─ settings/ products/ inventory/ orders/ blog/
├─ actions/                 # server actions (auth, settings, products, orders, blog, inquiry)
├─ components/
│  ├─ ui/                   # shadcn-style primitives (button, card, input, switch, table…)
│  ├─ coming-soon/          # landing page + countdown
│  ├─ site/                 # navbar, footer, product card, grids, forms, home page
│  ├─ admin/                # shell, forms, managers
│  └─ providers/            # LanguageProvider (en/ta/si)
├─ lib/
│  ├─ prisma.ts             # Prisma singleton
│  ├─ auth.ts               # bcrypt + jose JWT helpers
│  ├─ session.ts            # cookie session (create/get/destroy)
│  ├─ settings.ts           # cached getSettings() with safe defaults
│  ├─ whatsapp.ts           # wa.me order/contact link builders
│  ├─ utils.ts              # cn(), formatLKR(), slugify()
│  └─ i18n/dictionaries.ts  # translations
├─ middleware.ts            # protects /admin/* (JWT verify at edge)
└─ types/
prisma/
├─ schema.prisma            # data model
└─ seed.ts                  # admin + settings + sample data
```

## 3. Database design (Prisma / Cloudflare D1)

> Runs on **Cloudflare D1** (SQLite-compatible) via the Prisma driver adapter. The DB client is
> created per-request in `src/lib/prisma.ts` using `getCloudflareContext()`. Uploaded images are
> stored in **Cloudflare R2** (`/api/upload` writes, `/api/files/[...path]` serves). Enum-like
> fields (role, unit, order status) are stored as strings since D1/SQLite has no enum type.

| Model         | Purpose |
|---------------|---------|
| `Admin`       | Dashboard users. `passwordHash` (bcrypt), `role`. |
| `Setting`     | **Singleton** (`id = "singleton"`). `comingSoonMode`, brand, contact, socials, map, launch date. |
| `Category`    | Product grouping. |
| `Product`     | name, slug, price (Decimal), `unit` enum, `quantity` (stock), `available`, `featured`, image. |
| `Order` / `OrderItem` | Optional log of WhatsApp orders + `status` enum. |
| `BlogPost`    | title, slug, content, `published`, `publishedAt`. |
| `GalleryImage`| farm/rooftop/harvest photos. |
| `Inquiry`     | contact-form submissions, `handled` flag. |

Enums: `Role`, `ProductUnit (KG/PACK/BUNCH/PIECE/GRAM/LITRE)`, `OrderStatus`.

Designed to scale: indexed on availability/featured/status; catalog, orders, content and
inquiries are cleanly separated so you can add delivery zones, payments, or customer
accounts later without reshaping existing tables.

## 4. Auth flow

1. `loginAction` verifies email + bcrypt password against `Admin`.
2. On success it signs a JWT (`jose`, HS256, 7d) and stores it in an **httpOnly** cookie.
3. `middleware.ts` verifies that cookie on every `/admin/*` request (except `/admin/login`).
4. Server actions call `requireAdmin()` before any mutation — defence in depth.

## 5. Data mutations

All writes use **server actions** (no separate REST layer needed), each guarded by
`getSession()` and validated with **Zod**. `revalidatePath("/", "layout")` refreshes the
public site immediately after admin changes (e.g. toggling Coming Soon or editing stock).

## 6. Internationalisation

`LanguageProvider` (client) stores the locale in `localStorage` and exposes `t` from
`dictionaries.ts` (en/ta/si). The Coming Soon page and navigation are fully translated;
product/blog content is admin-authored in whichever language the owner types.

## 7. Ordering

`buildWhatsAppOrderLink()` turns a product + quantity into a `wa.me` deep link with a
pre-filled message, so customers order over WhatsApp with no checkout backend. Orders can
optionally be logged to the `Order` table for record-keeping.
