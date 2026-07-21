# Deploying to Cloudflare (GitHub → Workers)

This app runs on **Cloudflare Workers** using the OpenNext adapter, with **Cloudflare D1**
for the database and **Cloudflare R2** for uploaded images. You push your code to GitHub,
connect it to Cloudflare, and Cloudflare builds and deploys it for you.

You'll do a few one-time setup commands on your computer, then everything after is `git push`.

---

## 0. Prerequisites
- Node.js 18+ installed
- A free Cloudflare account
- A free GitHub account
- Git installed

Open a terminal in the project folder (the one containing `package.json`) and run `npm install` once.

---

## 1. Log in to Cloudflare from your terminal
```bash
npx wrangler login
```
A browser window opens — approve the access.

## 2. Create the database (D1)
```bash
npx wrangler d1 create greenroots-db
```
This prints a block including a `database_id`. **Copy that id.** Open `wrangler.jsonc`
and replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with it, then save.

## 3. Create the image storage bucket (R2)
```bash
npx wrangler r2 bucket create greenroots-uploads
```
> If Cloudflare asks you to enable R2 first (add a payment method — R2 has a free tier),
> do that once in the dashboard, then re-run the command.

## 4. Create the database tables
Generate the SQL from the schema, then apply it to your live D1 database:
```bash
npm run d1:sql > schema.sql
npx wrangler d1 execute greenroots-db --remote --file=schema.sql
```

---

## 5. Push the project to GitHub
Create a new **empty** repository on GitHub (no README), then:
```bash
git init
git add .
git commit -m "GreenRoots farm site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
Your secrets are safe: `.env` is gitignored and will **not** be uploaded.

---

## 6. Connect the repo to Cloudflare
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Workers** → **Connect to Git**.
2. Pick your GitHub repo.
3. Set the **build command** to:
   ```
   npx opennextjs-cloudflare build
   ```
   (Cloudflare deploys the built Worker automatically using your `wrangler.jsonc`.)
4. Before the first deploy, add your environment values under the project's
   **Settings → Variables and Secrets**. Add these as **Secret** (encrypted):
   - `AUTH_SECRET`  → a long random string (`openssl rand -base64 48`)
   - `BOOTSTRAP_TOKEN` → a random string (`openssl rand -hex 16`)
   - `ADMIN_EMAIL` → `admin`
   - `ADMIN_PASSWORD` → `Kindred123`
   - `ADMIN_NAME` → `Farm Admin`

   And add this one as a **plaintext Variable** (it's needed during the build):
   - `NEXT_PUBLIC_SITE_NAME` → `GreenRoots Organic Farm`

   (Use the same `AUTH_SECRET` and `BOOTSTRAP_TOKEN` you'll remember — they're already in your local `.env` if you want to reuse those.)
5. Deploy. When it finishes you'll get a URL like `https://greenroots-organic-farm.YOUR-SUBDOMAIN.workers.dev`.

The D1 database and R2 bucket are wired up automatically because they're declared in `wrangler.jsonc`.

---

## 7. Seed the database (one time)
Visit this URL once in your browser (use your real token):
```
https://YOUR-WORKER-URL/api/bootstrap?token=YOUR_BOOTSTRAP_TOKEN
```
You should see `{"ok":true,...}`. This creates your admin login, the site settings, and sample products.

Now go to **`https://YOUR-WORKER-URL/admin`** and log in:
- **Username:** `admin`
- **Password:** `Kindred123`

Toggle **Coming Soon** off in Website Settings whenever you're ready to launch the shop.

---

## 8. After that
Every time you change code, just:
```bash
git add .
git commit -m "update"
git push
```
Cloudflare rebuilds and redeploys automatically.

### Custom domain
In the Worker → **Settings → Domains & Routes**, add your domain (must be on your Cloudflare account).

### Security
- After seeding, you can change `BOOTSTRAP_TOKEN` in Cloudflare (the endpoint stays token-protected and is safe to leave; it won't duplicate data).
- Change the admin password once you're in.

---

## Running locally (optional)
Local dev uses a local copy of the database:
```bash
npx wrangler d1 execute greenroots-db --local --file=schema.sql
npm run dev
```
Then seed the local DB by visiting `http://localhost:3000/api/bootstrap?token=YOUR_BOOTSTRAP_TOKEN`
(uses the token from your `.env`). Log in at `http://localhost:3000/admin`.
