-- Same bug class as 0022_fix_null_jsonb_arrays.sql, which fixed the 5 health
-- facility tables but never covered the aid domain.
--
-- The frontend's Zod DTOs declare these array fields as `.optional()` (and in
-- some cases `.optional().default([])`) WITHOUT `.nullable()`. Neither form
-- accepts a JSON `null` — `.optional()` only permits the key being absent, and
-- `.default([])` only fills in `undefined`. So a single row with a NULL array
-- column makes `z.array(aidDtoSchema)` reject the ENTIRE page of results.
--
-- Observed impact: 4 of 12 aid_points rows had available_supplies = NULL, which
-- made aidsPaginatedResponseSchema.parse() throw in lib/api/aid.ts. That
-- rejection propagated through fetchAllAidPages() into syncAid()'s silent
-- `catch {}` (lib/offline/sync.ts), leaving the IndexedDB `aid` store empty, so
-- /humanitarian-aid rendered "لا توجد مساعدات مطابقة للبحث" for every user —
-- all 12 points hidden by 4 bad rows.
--
-- schemas/aidApi.ts and schemas/aidDonorsApi.ts are hardened to accept null
-- alongside this migration; both halves are wanted (tolerant client, clean data).

update aid_points set available_supplies = '{}'::text[] where available_supplies is null;
update aid_points set working_days       = '{}'::int[]  where working_days is null;
update aid_points set target_groups      = '{}'::text[] where target_groups is null;
update aid_points set inventory          = '[]'::jsonb  where inventory is null;

update aid_donors set focus_areas = '{}'::text[] where focus_areas is null;

-- Default them going forward so a future insert that omits the column cannot
-- reintroduce the NULL.
alter table aid_points alter column available_supplies set default '{}'::text[];
alter table aid_points alter column working_days       set default '{}'::int[];
alter table aid_points alter column target_groups      set default '{}'::text[];
alter table aid_points alter column inventory          set default '[]'::jsonb;

alter table aid_donors alter column focus_areas set default '{}'::text[];
