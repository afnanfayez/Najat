-- Health facilities: 5 tables mirroring the 5 existing endpoint bases exactly
-- (docs/BACKEND_API_SPEC.md §3), sharing a common column set, plus a UNION ALL
-- view for the composed /v1/providers endpoint.

-- Common columns repeated on each table (no inheritance used, to keep each
-- table's constraints/indexes independent and match the CRUD factory's
-- per-table config in Phase 4):
--   id, name, address, contact_number, image, latitude, longitude, status,
--   working_doctors jsonb, current_medications jsonb, working_hours,
--   working_days text[], medical_supplies text[], healthcare_categories text[],
--   created_at, updated_at, deleted_at
-- Each table also gets a generated `geo` geography(Point,4326) column so
-- nearby-search can use a real spatial index while the wire format stays
-- plain latitude/longitude numbers.

create table hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  contact_number text,
  image text,
  latitude double precision not null,
  longitude double precision not null,
  geo geography(Point, 4326) generated always as (
    case when longitude is not null and latitude is not null
      then ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
    end
  ) stored,
  status text check (status in ('full', 'available', 'critical', 'closed')),
  icu_capacity int,
  total_beds int,
  emergency_level text check (emergency_level in ('level_1', 'level_2', 'level_3')),
  working_doctors jsonb,
  current_medications jsonb,
  working_hours text,
  working_days text[],
  medical_supplies text[],
  healthcare_categories text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index hospitals_geo_idx on hospitals using gist (geo);
create trigger trg_hospitals_updated_at before update on hospitals
  for each row execute function set_updated_at();

create table pharmacies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  contact_number text,
  image text,
  latitude double precision not null,
  longitude double precision not null,
  geo geography(Point, 4326) generated always as (
    case when longitude is not null and latitude is not null
      then ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
    end
  ) stored,
  status text,
  is_24_hours boolean not null default false,
  delivery_available boolean not null default false,
  delivery_radius numeric,
  working_doctors jsonb,
  current_medications jsonb,
  working_hours text,
  working_days text[],
  medical_supplies text[],
  healthcare_categories text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index pharmacies_geo_idx on pharmacies using gist (geo);
create trigger trg_pharmacies_updated_at before update on pharmacies
  for each row execute function set_updated_at();

create table labs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  contact_number text,
  image text,
  latitude double precision not null,
  longitude double precision not null,
  geo geography(Point, 4326) generated always as (
    case when longitude is not null and latitude is not null
      then ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
    end
  ) stored,
  status text,
  available_tests jsonb,       -- [{name, type, resultTime}]
  home_collection boolean not null default false,
  iso_certified boolean not null default false,
  working_doctors jsonb,
  current_medications jsonb,
  working_hours text,
  working_days text[],
  medical_supplies text[],
  healthcare_categories text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index labs_geo_idx on labs using gist (geo);
create trigger trg_labs_updated_at before update on labs
  for each row execute function set_updated_at();

create table clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  contact_number text,
  image text,
  latitude double precision not null,
  longitude double precision not null,
  geo geography(Point, 4326) generated always as (
    case when longitude is not null and latitude is not null
      then ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
    end
  ) stored,
  status text,
  specialties text[],
  practitioners_count int,
  working_doctors jsonb,
  current_medications jsonb,
  working_hours text,
  working_days text[],
  medical_supplies text[],
  healthcare_categories text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index clinics_geo_idx on clinics using gist (geo);
create trigger trg_clinics_updated_at before update on clinics
  for each row execute function set_updated_at();

create table dental_clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  contact_number text,
  image text,
  latitude double precision not null,
  longitude double precision not null,
  geo geography(Point, 4326) generated always as (
    case when longitude is not null and latitude is not null
      then ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
    end
  ) stored,
  status text,
  dental_chairs int,
  implants_available boolean not null default false,
  orthodontics_available boolean not null default false,
  available_tests jsonb,
  working_doctors jsonb,
  current_medications jsonb,
  working_hours text,
  working_days text[],
  medical_supplies text[],
  healthcare_categories text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index dental_clinics_geo_idx on dental_clinics using gist (geo);
create trigger trg_dental_clinics_updated_at before update on dental_clinics
  for each row execute function set_updated_at();

-- Composed read-only view backing GET /v1/providers and /v1/providers/nearby.
-- security_invoker (default in modern Postgres) means the view respects each
-- underlying table's RLS policies — no separate view-level policy needed.
create view providers as
  select id, name, address, image, latitude, longitude, geo, status,
         'hospital'::text as type, created_at, updated_at, deleted_at
    from hospitals
  union all
  select id, name, address, image, latitude, longitude, geo, status,
         'pharmacy'::text as type, created_at, updated_at, deleted_at
    from pharmacies
  union all
  select id, name, address, image, latitude, longitude, geo, status,
         'lab'::text as type, created_at, updated_at, deleted_at
    from labs
  union all
  select id, name, address, image, latitude, longitude, geo, status,
         'clinic'::text as type, created_at, updated_at, deleted_at
    from clinics
  union all
  select id, name, address, image, latitude, longitude, geo, status,
         'dental'::text as type, created_at, updated_at, deleted_at
    from dental_clinics;
