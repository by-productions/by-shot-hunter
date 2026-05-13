# B.Y Shot Hunter — Claude Code Project Brief

## What this is

A gamified mobile-first web app for **B.Y Productions** ([by-p.com](https://www.by-p.com/)), a leading Israeli event production company. The app turns the "atmosphere shot checklist" into a hunting game — photographers earn XP, climb ranks, and unlock achievements as they capture key shots at events. The goal is to make tired photographers actually *enjoy* finding the design, branding, food, and production details that B.Y needs for their post-event summary videos and marketing.

**Language:** Hebrew (RTL).
**Target audience:** Video photographers at B.Y events. Sent to them before the event (link or QR code at venue).

## Brand identity

Colors taken from by-p.com — black background, with three accent colors used categorically:
- `#ff3d7a` (pink) — primary accent, CTAs, "Productions"
- `#d6ff3a` (lime/yellow) — XP, "Content"
- `#3affd3` (mint/teal) — "Exhibitions"

Typography: bold black uppercase English display (like "WHAT CAN WE DO FOR YOU" on by-p.com) combined with Hebrew in **Rubik** — used across the entire app for display (900) and body (400/500). Mono accents in JetBrains Mono.

## Stack

- **Vite + React 18** (no TypeScript — kept JS for fast iteration)
- **React Router** for URL params (`?event=...&p=...`)
- **Tailwind CSS** with extended config for brand colors
- **Supabase** for backend (events, per-event hunts, photographer progress, cross-device sync)
- **localStorage** as offline fallback — app works fully without Supabase env vars

## Architecture

```
src/
├── main.jsx              # Entry — wraps App in BrowserRouter
├── App.jsx               # Main page composing all sections
├── index.css             # Tailwind + custom CSS vars + animations
├── components/
│   ├── HUD.jsx           # Sticky top bar — rank, XP, progress
│   ├── Hero.jsx          # Opening section with crosshair animation
│   ├── HuntCard.jsx      # Single hunt with expand + mark button
│   ├── RanksStrip.jsx    # Horizontal scrolling rank tiers
│   ├── Achievements.jsx  # 2x3 grid of badges (locked/unlocked)
│   ├── TabBar.jsx        # Bottom mobile nav with scroll spy
│   ├── Toast.jsx         # XP toast notifications + useToasts hook
│   └── Celebration.jsx   # Full-screen modal for rank-ups/achievements
├── lib/
│   ├── supabase.js       # Client init — null if env vars missing
│   ├── useHunterState.js # Central hook — loads hunts, manages progress
│   └── confetti.js       # DOM-based confetti burst utility
└── data/
    └── defaults.js       # Fallback hunts + ranks + achievements (used when no event_id)
```

## Data flow

1. **URL params drive context:**
   - `?event=<uuid>` — loads event-specific hunts from `event_hunts` table
   - `?p=<photographer_id>` — links progress to a specific photographer (e.g. from QR code)
   - No params → uses defaults, generates random local photographer ID

2. **Progress sync (in `useHunterState`):**
   - Load: localStorage first (instant), then overlay Supabase data (eventual consistency)
   - Save: write localStorage immediately, upsert to Supabase in background
   - If Supabase env vars are missing, app silently works offline

3. **Game mechanics:**
   - 8 hunts × variable XP (100-250) = total XP pool
   - 4 ranks: Rookie (0+) → Hunter (200+) → Sharpshooter (600+) → Master (1200+)
   - 6 achievements based on progress milestones, all evaluated on every toggle

## Supabase setup

Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor. It creates 3 tables (`events`, `event_hunts`, `hunt_progress`), enables RLS with public policies for MVP, and seeds one demo event with 8 hunts.

To test: visit `/?event=00000000-0000-0000-0000-000000000001` (the seed event UUID).

**Tighten RLS later:** current policies allow public read/write. When you add photographer auth, swap to `auth.uid()`-based policies on `hunt_progress`.

## Things to build next (priority order)

### 1. Admin dashboard (high priority)
Route: `/admin` (protected). Lets B.Y staff:
- Create events with custom name + client + date
- Customize the 8 hunts per event (override defaults, change XP values, hints, details)
- View live leaderboard of all photographers in an active event
- Generate the QR code with embedded `event_id`

### 2. QR code generator (high priority)
Add `qrcode.react` (already in `package.json` deps in original spec, may need install). Page at `/admin/qr?event=<id>` that displays a printable QR pointing to `/?event=<id>&src=qr`. The `src=qr` param can drive a slightly different opening animation/copy ("סרקת. הצידה מתחילה.").

### 3. Multi-photographer leaderboard
At an event with 2+ photographers, show a small leaderboard widget (Supabase Realtime channel subscription on `hunt_progress` rows for the event). Adds healthy competition. Sub-publish on `postgres_changes`, throttle UI updates.

### 4. Photo upload verification (medium)
Optional — let photographers attach a photo to "prove" each catch. Supabase Storage bucket `hunt-proofs/`, RLS scoped per photographer. Display thumbnails in admin dashboard.

### 5. End-of-event handoff (medium)
Currently the app just says "transfer materials to the content producer." Make this a real flow: button that generates a summary (which hunts found, total XP, screenshots) and lets the photographer share it via WhatsApp deep link to the producer.

### 6. Production polish
- Replace placeholder favicon
- Add a real splash screen icon for PWA install
- Open Graph meta tags so WhatsApp/SMS link previews look good
- Hebrew accessibility audit (screen reader test)

## Deployment

Designed for **Vercel** (zero config — just import the repo):
1. Push to GitHub
2. Import to Vercel
3. Set env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Deploy

For custom domain, point to Vercel's nameservers. B.Y could use `hunter.by-p.com` as a subdomain.

## Conventions

- **Hebrew copy lives inline in components** — no i18n layer yet (English support could be added if B.Y goes international)
- **All animations are CSS keyframes** — no Framer Motion to keep bundle small
- **No CSS-in-JS lib** — inline `style` for dynamic values + Tailwind for static
- **Mobile-first** — desktop uses `max-width: 480px` to feel like a phone app even on big screens

## What NOT to change without asking

- **Brand colors** — these are pulled directly from by-p.com, don't substitute
- **The "ערב טוב, צייד" headline** — this took several iterations to land on
- **The 4 "Avoid" rules** — these are real pain points the producer wants emphasized
- **The relationship between this app and the on-site producer** — the app is *supplementary*. The producer has the authoritative event-specific list. This app provides general guidance + gamification. Don't add features that conflict with this.

## Original conversation context

This project was built iteratively with the producer. Key decisions:
- Started as a static PDF checklist → felt too "demanding"
- Tried a manifesto-style letter → felt too "AI-generated" and floral
- Settled on gamified mobile app with light gamification + a real practical checklist
- The "Shot Hunter" framing makes photographers feel like players, not task-doers
