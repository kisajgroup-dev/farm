# Deploying GreenRoots to Vercel

This project runs on Vercel with Neon Postgres and Vercel Blob. The domain registrar and DNS can remain at Hostinger. Prisma connects through Neon’s pooled Postgres URL and is generated with the Vercel-compatible Linux query engine during each build.

## 1. Create the services

1. Import this Git repository into Vercel and create the project.
2. In the Vercel Marketplace, create a **Neon Postgres** database and connect it to this project.
3. In the Vercel project, open **Storage**, create a **Blob** store, and connect it to the project.

## 2. Add environment variables

In Vercel project **Settings → Environment Variables**, add these for Production, Preview, and Development:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Neon’s pooled Postgres connection string |
| `BLOB_READ_WRITE_TOKEN` | Token supplied by the connected Vercel Blob store |
| `AUTH_SECRET` | A long random secret, for example from `openssl rand -base64 48` |
| `BOOTSTRAP_TOKEN` | A separate random token for the one-time seed endpoint |
| `ADMIN_EMAIL` | Your initial admin username/email |
| `ADMIN_PASSWORD` | A strong initial admin password |
| `ADMIN_NAME` | Your admin display name |

## 3. Create the database tables

Copy `DATABASE_URL` into a local `.env` file, then run:

```bash
npm install
npm run db:push
```

Deploy from Vercel after the schema has been pushed. Visit:

```
https://YOUR-VERCEL-URL/api/bootstrap?token=YOUR_BOOTSTRAP_TOKEN
```

This creates the initial admin account and sample content. It is idempotent.

## 4. Attach the Hostinger subdomain

1. In Vercel, open the project → **Settings → Domains** and add `farm.kindredgrp.com`.
2. Vercel will show the exact CNAME target for this project.
3. In Hostinger’s DNS Zone Editor, create a CNAME record with name `farm` and the exact target supplied by Vercel.
4. Wait for Vercel to verify the DNS record and issue TLS.

Keep all other `kindredgrp.com` DNS records at Hostinger. Only the `farm` subdomain is directed to Vercel.

## Migrating existing Cloudflare data

The existing D1 database and R2 objects are not automatically copied by a deployment. Export the D1 data and copy R2 images before decommissioning Cloudflare. The application accepts direct Vercel Blob URLs for all new uploads; the legacy `/api/files/...` endpoint redirects an object after it has been copied to Blob with the same pathname.
