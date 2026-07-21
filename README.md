# 🌱 GreenRoots — Organic Farm Platform

A production-ready, scalable web platform for a small organic farming business in Kalmunai, Sri Lanka.
It ships in **two phases controlled from one admin toggle** — no rebuild required:

- **Phase 1 — Coming Soon:** a premium landing page while the farm is being prepared.
- **Phase 2 — Full shop:** home, products, gallery, blog, contact + WhatsApp ordering.

Flip **Coming Soon Mode** ON/OFF in the Admin Portal to switch between them.

> **Deploying to Cloudflare?** Follow **[CLOUDFLARE-DEPLOY.md](./CLOUDFLARE-DEPLOY.md)** — a step-by-step
> GitHub → Cloudflare guide. This app is configured for Cloudflare Workers (via OpenNext) with
> **D1** (database) and **R2** (image uploads).

---

## ✨ Features

- **Website mode control** — one switch: Coming Soon page ↔ full e-commerce site.
- **Premium Coming Soon page** — hero + countdown, story, vision, rooftop & Palamunai projects, future products, WhatsApp CTA, location map, socials. Animated with Framer Motion.
- **WhatsApp ordering** — customers pick a product + quantity and a pre-filled order message opens in WhatsApp.
- **Admin Portal** — dashboard, website settings, product management, inventory, orders & inquiries, blog.
- **3 languages** — English (default), Tamil, Sinhala, switchable live.
- **Secure admin auth** — hashed passwords (bcrypt) + signed JWT session cookie + middleware-protected routes.
- **Mobile-first** responsive design, SEO metadata.

## 🧰 Tech Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn-style UI · Framer Motion · Prisma + Cloudflare D1 · R2 storage · OpenNext · jose (JWT) · Zod.

---

## 🚀 Deploy

Full instructions are in **[CLOUDFLARE-DEPLOY.md](./CLOUDFLARE-DEPLOY.md)**. In short:

1. `npx wrangler login`, then create a D1 database and an R2 bucket.
2. Put the D1 `database_id` into `wrangler.jsonc`.
3. `npm run d1:sql > schema.sql` and apply it with `wrangler d1 execute … --remote --file=schema.sql`.
4. Push to GitHub, connect the repo in Cloudflare (build command `npx opennextjs-cloudflare build`), add your secrets.
5. Visit `/api/bootstrap?token=…` once to seed, then log in at `/admin`.

The site starts in **Coming Soon mode**; toggle it **OFF** in Website Settings to reveal the full shop.

---

## 💻 Run locally (optional)

```bash
npm install
npx wrangler d1 execute greenroots-db --local --file=schema.sql   # after generating schema.sql
npm run dev
```
Then seed the local DB by visiting `http://localhost:3000/api/bootstrap?token=<BOOTSTRAP_TOKEN from .env>`
and log in at `http://localhost:3000/admin`.

---


## 🗂 Project structure

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full breakdown of folders, database design, and how the mode switch works.

## 🔐 First things to change

1. Admin password (log in, or reseed with a new `ADMIN_PASSWORD`).
2. `AUTH_SECRET` in production.
3. Site title, WhatsApp number, socials and map coordinates in **Admin → Website Settings**.
4. Replace the sample Unsplash images with your own farm photos.
