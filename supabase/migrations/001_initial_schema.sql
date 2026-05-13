-- ============================================
-- B.Y Shot Hunter — Database Schema
-- ============================================
-- Run this in your Supabase SQL editor.

-- 1. EVENTS
create table if not exists public.events (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  client_name     text,
  event_date      date,
  created_at      timestamptz not null default now(),
  metadata        jsonb default '{}'::jsonb
);

-- 2. EVENT_HUNTS — the 8 (or N) hunts per event
create table if not exists public.event_hunts (
  id              uuid primary key default gen_random_uuid(),
  event_id        uuid not null references public.events(id) on delete cascade,
  order_idx       int not null default 0,
  title           text not null,
  hint            text,
  xp              int not null default 100,
  details         text[] default '{}',
  created_at      timestamptz not null default now()
);
create index if not exists idx_event_hunts_event_id on public.event_hunts(event_id);

-- 3. HUNT_PROGRESS — photographer progress per event
create table if not exists public.hunt_progress (
  id                uuid primary key default gen_random_uuid(),
  event_id          uuid not null references public.events(id) on delete cascade,
  photographer_id   text not null,
  photographer_name text,
  found_ids         text[] default '{}',
  achievements      text[] default '{}',
  xp                int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (event_id, photographer_id)
);
create index if not exists idx_hunt_progress_event_id on public.hunt_progress(event_id);

-- Row Level Security — public for MVP. Tighten with auth later.
alter table public.events enable row level security;
alter table public.event_hunts enable row level security;
alter table public.hunt_progress enable row level security;

drop policy if exists "events_read" on public.events;
create policy "events_read" on public.events for select using (true);

drop policy if exists "event_hunts_read" on public.event_hunts;
create policy "event_hunts_read" on public.event_hunts for select using (true);

drop policy if exists "hunt_progress_read" on public.hunt_progress;
create policy "hunt_progress_read" on public.hunt_progress for select using (true);

drop policy if exists "hunt_progress_insert" on public.hunt_progress;
create policy "hunt_progress_insert" on public.hunt_progress for insert with check (true);

drop policy if exists "hunt_progress_update" on public.hunt_progress;
create policy "hunt_progress_update" on public.hunt_progress for update using (true);

-- SEED — example event
insert into public.events (id, name, client_name, event_date) values
  ('00000000-0000-0000-0000-000000000001', 'דוגמה — אירוע השקה', 'Demo Client', current_date)
on conflict (id) do nothing;

insert into public.event_hunts (event_id, order_idx, title, hint, xp, details) values
  ('00000000-0000-0000-0000-000000000001', 1, 'הפריט שאף אחד לא ישים לב אליו', 'פרט עיצוב קטן שעבדנו עליו ושאף אחד לא יזכור.', 150, array['משהו מינוסי, אישי, אופייני לאירוע הזה', 'תקריב חזק, רקע נקי', 'אורך 4-5 שניות לפחות']),
  ('00000000-0000-0000-0000-000000000001', 2, 'החלל הריק, רגע לפני', 'החלון הקצר והיקר ביותר — לפני שהאורחים נכנסים.', 200, array['וייד שוט שמראה את הסקאלה', 'תאורת ההפקה דלוקה, האולם ריק', 'סלואו טראקינג / pan איטי עובד מצוין']),
  ('00000000-0000-0000-0000-000000000001', 3, 'המנה לפני שאוכלים אותה', 'כל קרייטיב של אוכל. שולחנות, בר, קינוחים.', 100, array['Top-down של שולחן ערוך', 'תקריב על קינוח/קוקטייל ייחודי', 'להגיע מוקדם — לפני שמסתערים']),
  ('00000000-0000-0000-0000-000000000001', 4, 'הלוגו בלי שביקשו ממנו', 'המיתוג של הלקוח בפריים באופן טבעי.', 150, array['על שלט, על מסך, על מתנה', 'לא קופץ ולא מאולץ', 'עדיף בהקשר — לוגו + פעולה ברקע']),
  ('00000000-0000-0000-0000-000000000001', 5, 'צל, אור, שתיים-שלוש שניות', 'תאורת ההפקה כשהיא במיטבה.', 200, array['Beam-ים, צבעים, אטמוספירה', 'כשהאולם חשוך והאורות פעילים', 'שווה לדבוק במקום אחד 30 שניות']),
  ('00000000-0000-0000-0000-000000000001', 6, 'המבט מלמעלה', 'מבט עליון על שולחן, חלל, מופע.', 250, array['דרון אם זמין', 'סטנדים גבוהים / מעקה / יציע', 'מספר על סקאלת ההפקה']),
  ('00000000-0000-0000-0000-000000000001', 7, 'הרגע שהקהל הרגיש משהו', 'תגובות אמיתיות — צחוק, התלהבות, השתאות.', 200, array['לא פוזות — תגובות בזמן אמת', 'במהלך הרצאה / הופעה / הפתעה', 'שלא יראו את המצלמה — חכה ברקע']),
  ('00000000-0000-0000-0000-000000000001', 8, 'המסך, החלל, הסקאלה', 'שוט שמראה כמה הפקה גדולה זאת.', 250, array['קירות LED, גרפיקות, תאורה, גובה', 'מבט מאחורי הקהל לכיוון הבמה', 'וייד מאוד — שיהיה אוויר מסביב'])
on conflict do nothing;
