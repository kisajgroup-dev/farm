# GreenRoots Organic Farm

A Next.js platform for a small organic farming business in Kalmunai, Sri Lanka. It has a public Coming Soon / shop experience and a protected admin portal for products, settings, inventory, blog posts, and inquiries.

## Stack

Next.js 15 · TypeScript · Tailwind CSS · Prisma · Neon Postgres · Vercel Blob · jose · Zod

## Deploy to Vercel

This project is prepared for Vercel. Full setup instructions, including the Hostinger DNS record for `farm.kindredgrp.com`, are in [VERCEL-DEPLOY.md](./VERCEL-DEPLOY.md).

In brief:

1. Import this repository into Vercel.
2. Connect a Neon Postgres database and a Vercel Blob store.
3. Configure `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`, `BOOTSTRAP_TOKEN`, and the initial admin values in Vercel.
4. Run `npm run db:push` with `DATABASE_URL` in your local `.env`.
5. Deploy, call `/api/bootstrap?token=...` once, then add the `farm.kindredgrp.com` custom domain in Vercel.

Your domain can remain at Hostinger. Vercel gives you a CNAME target; create the `farm` CNAME record in Hostinger’s DNS Zone Editor.

## Local development

```bash
npm install
cp .env.example .env
# Set DATABASE_URL and BLOB_READ_WRITE_TOKEN in .env
npm run db:push
npm run dev
```

Then initialize data with `http://localhost:3000/api/bootstrap?token=YOUR_BOOTSTRAP_TOKEN` and sign in at `/admin`.

## Important first changes

1. Use a unique strong `AUTH_SECRET` and `BOOTSTRAP_TOKEN` in Vercel.
2. Use a strong `ADMIN_PASSWORD` for the initial seed.
3. Change site branding, contact details, and social links in **Admin → Website Settings**.
4. Upload your own farm images from the admin portal.
