-- The frontend's Zod DTOs (schemas/hospitalApi.ts, pharmacyApi.ts, labApi.ts)
-- declare currentMedications/workingDoctors as `.optional()` WITHOUT
-- `.nullable()` — a JSON `null` value fails validation (only `undefined`,
-- i.e. the key being absent, is accepted), so any row where the column ended
-- up NULL (seed data that never set the field) broke client-side parsing and
-- silently dropped the whole facility from Promise.allSettled aggregations
-- (e.g. the admin health-facilities page). Backfill existing NULLs to '[]'
-- and default the columns going forward so this can't recur.

update hospitals set current_medications = '[]'::jsonb where current_medications is null;
update pharmacies set working_doctors = '[]'::jsonb where working_doctors is null;
update labs set working_doctors = '[]'::jsonb where working_doctors is null;

alter table hospitals alter column current_medications set default '[]'::jsonb;
alter table pharmacies alter column working_doctors set default '[]'::jsonb;
alter table labs alter column working_doctors set default '[]'::jsonb;

-- Same class of bug could recur for any other jsonb/array column the seed
-- happened to leave unset — default every optional jsonb/array facility
-- column across all 5 tables to an empty collection instead of NULL.
alter table hospitals alter column working_doctors set default '[]'::jsonb;
alter table hospitals alter column medical_supplies set default '{}'::text[];
alter table hospitals alter column healthcare_categories set default '{}'::text[];
alter table hospitals alter column working_days set default '{}'::text[];

alter table pharmacies alter column current_medications set default '[]'::jsonb;
alter table pharmacies alter column medical_supplies set default '{}'::text[];
alter table pharmacies alter column healthcare_categories set default '{}'::text[];
alter table pharmacies alter column working_days set default '{}'::text[];

alter table labs alter column current_medications set default '[]'::jsonb;
alter table labs alter column available_tests set default '[]'::jsonb;
alter table labs alter column medical_supplies set default '{}'::text[];
alter table labs alter column healthcare_categories set default '{}'::text[];
alter table labs alter column working_days set default '{}'::text[];

alter table clinics alter column working_doctors set default '[]'::jsonb;
alter table clinics alter column current_medications set default '[]'::jsonb;
alter table clinics alter column specialties set default '{}'::text[];
alter table clinics alter column medical_supplies set default '{}'::text[];
alter table clinics alter column healthcare_categories set default '{}'::text[];
alter table clinics alter column working_days set default '{}'::text[];

alter table dental_clinics alter column working_doctors set default '[]'::jsonb;
alter table dental_clinics alter column current_medications set default '[]'::jsonb;
alter table dental_clinics alter column available_tests set default '[]'::jsonb;
alter table dental_clinics alter column medical_supplies set default '{}'::text[];
alter table dental_clinics alter column healthcare_categories set default '{}'::text[];
alter table dental_clinics alter column working_days set default '{}'::text[];

-- The crud factory's create()/update() pass through exactly the JSON keys the
-- caller sent (see lib/api-handlers/crudFactory.ts) — an explicit `null` in
-- a request body still overrides the column default, so also backfill (not
-- just default) any future direct-null writes is out of scope here; this
-- migration only fixes the seed-data-shaped gap identified above.
