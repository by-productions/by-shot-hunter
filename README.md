# B.Y Shot Hunter

Gamified atmosphere shot guide for B.Y Productions photographers.
"ערב טוב, צייד. היום אתה לא צלם, אתה צייד פריימים."

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 — works fully offline (localStorage).

## Optional: connect Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. In SQL editor, paste & run `supabase/migrations/001_initial_schema.sql`
3. Copy `.env.example` to `.env` and fill in:
   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   ```
4. Restart dev server
5. Visit with the seed event:
   `http://localhost:5173/?event=00000000-0000-0000-0000-000000000001`

## URL params

- `?event=<uuid>` — load event-specific hunts
- `?p=<photographer_id>` — link progress to a photographer (use in QR codes)

## Build & deploy

```bash
npm run build      # outputs ./dist
npm run preview    # serve the build locally
```

Deploy to Vercel: push to GitHub → import → add the two `VITE_SUPABASE_*` env vars → deploy.

## Project structure

See **CLAUDE.md** for full architecture details and roadmap.

```
src/
├── App.jsx              # main page composition
├── components/          # HUD, Hero, HuntCard, etc.
├── lib/                 # supabase client, state hook, confetti
└── data/defaults.js     # fallback hunts/ranks/achievements
supabase/migrations/     # SQL schema
```

## Tech stack

Vite · React 18 · Tailwind · Supabase · React Router
