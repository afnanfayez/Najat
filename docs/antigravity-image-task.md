# Task for Antigravity: generate and wire in the facility/article images

You're working in the Najat repo (Next.js 16 + Supabase crisis-response platform). 35 DB
records currently have `image: null`. The prompts for all 35 already exist, written and
reviewed, in **`docs/image-prompts.md`** — read that file first, it has the full style guide and
one prompt + suggested filename per record, grouped by entity type (10 hospitals, 6 pharmacies,
5 labs, 4 clinics, 3 dental clinics, 7 articles).

## Goal

For each of the 35 entries in `docs/image-prompts.md`:
1. Generate the image with Gemini image generation, using the prompt text exactly as written.
2. Upload it to the correct Supabase Storage bucket.
3. Update the matching database row's `image` column to the uploaded file's public URL.
4. Then verify, live in the running app, that each image actually renders in its correct place
   — not just that the upload succeeded.

## Environment / credentials

- Supabase project URL and keys are already in `.env` at the repo root
  (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
  Use the **service role key** for the upload/DB-write script (it bypasses RLS, which is
  necessary since these writes aren't going through an authenticated admin browser session).
  Never print, log, or commit that key anywhere.
- `NEXT_PUBLIC_USE_MOCK_DATA=false` is already set — the app is live against real Supabase, not
  mock data. Don't change that flag.
- Storage buckets already exist (`supabase/migrations/0013_storage_buckets.sql`):
  `facility-images` for hospitals/pharmacies/labs/clinics/dental_clinics, `article-images` for
  articles. Both are public-read.

## Matching each generated image to its DB row

Match by exact name, scoped to the right table (there's no shared numeric id between the prompts
file and the DB — the seed script's placeholder ids like `hosp-001` aren't what's stored):

| Section in image-prompts.md | Table | Match column |
|---|---|---|
| Hospitals | `hospitals` | `name` (exact match, e.g. `مستشفى الشفاء`) |
| Pharmacies | `pharmacies` | `name` |
| Labs | `labs` | `name` |
| Clinics | `clinics` | `name` |
| Dental clinics | `dental_clinics` | `name` |
| Health-guide articles | `articles` | `title_ar` |

Write a small one-off Node/TS script (same pattern as `scripts/seed-supabase.ts` — it already
shows how to construct a service-role Supabase client via `lib/supabase/serviceRole.ts`) that:
1. Parses `docs/image-prompts.md` (or just hardcodes the 35 name→prompt pairs read from it —
   either is fine, this is a throwaway script, not something that needs to stay maintainable).
2. For each entry: generate the image, upload it to the right bucket under a sensible path (e.g.
   `facility-images/hospitals/<slug>.png`, `article-images/<slug>.png`), get the public URL via
   Supabase Storage's `getPublicUrl`, then `update` the matching row's `image` column by `name`
   (or `title_ar` for articles).
3. Log a clear success/failure line per record (35 total) so partial failures are easy to spot
   and re-run individually — don't let one failure abort the whole batch.
4. Skip records where `image` is already non-null (idempotent re-runs, in case you need to retry
   after fixing something).

Delete the throwaway script when done, or leave it — your call, it's not part of the app's
runtime code either way.

## Verification (do this after the writes, don't just trust 35/35 "success" logs)

1. Start the dev server (`npm run dev`) if it isn't already running.
2. Log in as `admin@najat.ps` / `Admin@12345` (real Supabase account, already seeded).
3. Resident-facing pages — confirm real photos render instead of the local placeholder
   (`/assets/health1.jpg` for facilities, `/assets/artical.png` for articles — if you see either
   of those after the update, that record's write didn't take):
   - `/hospitals`, `/pharmacies`, `/labs`, `/clinics`, `/dental-clinics` — card list views
   - open at least 2–3 individual facility detail pages per type to confirm the hero image too
   - `/health-guide` — article cards, plus open at least 2 individual articles
4. Spot-check the DB directly for a couple of records (`select name, image from hospitals` etc.
   via the Supabase REST API with the service role key) to confirm the URL was actually written,
   not just that the UI happens to be caching something.
5. Report back: how many of the 35 rendered correctly, and list any that didn't (with the
   record name and what went wrong — upload failure, DB write failure, or wrong match).

## Scope guardrails

- Only touch the `image` column on these 6 tables and Supabase Storage — don't modify schema,
  routes, RLS policies, or any other app code.
- Don't regenerate or edit `docs/image-prompts.md` — if a specific prompt produces a bad image,
  regenerate with the same prompt text rather than rewriting the prompt.
- Don't touch `lib/mocks/` or flip any mock-related flags.
