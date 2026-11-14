# PPSC Prep Coach

A personal study app for Punjab Police / Special Branch PPSC recruitment preparation — with real accounts, cloud-saved progress, and a date-anchored 12-week programme.

## Features
- **Login / accounts** — sign up once, your progress follows you on any device (Supabase)
- **12-week plan locked to real dates** — Day 1 = Monday 16 Nov 2026; Mon–Sat study, Sunday revision + mock
- **Daily lessons** with revision notes (added day by day by your AI tutor)
- **Daily quizzes** — 15 MCQs, live timer, auto-scoring, explanations for every mistake
- **Every attempt is saved** — retakes are recorded as new attempts with date and time; best score shown
- **Mistake log** — auto-collected from quizzes; reviewed items kept in history
- **Mock tests** — weekly (50 Q) and monthly (full-length), unlocked as you finish weeks
- **Progress report** — score trend chart, per-topic performance, daily-habit heatmap
- **2-hour daily routine checklist**, streak tracking, current affairs notes
- **Backup / restore** of all your data

## One-time setup (10 minutes)

### 1. Create the database (Supabase — free)
1. Go to https://supabase.com → Start your project → sign up (GitHub/email)
2. Create a new project (any name, e.g. `ppsc-prep`). Wait ~1 minute for it to be ready.
3. Open **SQL Editor** → New query → paste the whole contents of `supabase/schema.sql` → **Run**. This creates all tables, security rules, and the profile auto-create trigger.
4. Open **Authentication → Providers → Email** → turn OFF **Confirm email** (personal use — you can sign up and start immediately).
5. Open **Project Settings → API** → copy:
   - Project URL
   - anon public key

### 2. Point the app at your database
Create a file named `.env` inside this `app/` folder:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run locally
```bash
npm install
npm run dev        # → http://localhost:5173
```
You will now see the login screen. Create your account and start.

> Without the `.env` file the app still works in **local mode** (progress in that browser only).

## Deploy on Vercel

### Way 1 — quick (recommended)
```bash
npm i -g vercel
vercel             # first time: log in / create account, accept defaults
vercel --prod      # re-run after every update
```
Then add the two environment variables in Vercel:
**Project → Settings → Environment Variables → Add** — `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (same values as your `.env`). Redeploy.

### Way 2 — via GitHub (auto-deploy on every push)
1. Push this folder to a GitHub repo.
2. On vercel.com: **Add New Project → Import the repo → Framework Preset: Vite** (Root Directory: `app` if you pushed the whole study folder).
3. Add the two environment variables in Project Settings, then deploy.

Render also works (Static Site service) — same repo-import flow. Vercel is simpler for this app.

## How lessons are added
Your tutor adds each day's lesson as a file in `src/data/lessons/` (e.g. `day03.js`) and links it in `src/data/plan.js`. The app picks up new files automatically. Mocks go in `src/data/mocks/`.

## Security & privacy
- The anon key is public by design; **Row Level Security** (in schema.sql) means each user can only read/write their own rows.
- In local mode everything stays in your browser's localStorage.

## Notes
- Reference material only: always verify the official syllabus on ppssc.gop.pk.
