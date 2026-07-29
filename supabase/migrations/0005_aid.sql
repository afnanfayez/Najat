-- Aid: aid_points, aid_requests, aid_donors. See docs/BACKEND_API_SPEC.md §2.
-- aid_points folds in the admin-aid "extended" fields the frontend already has
-- wired up as `// TODO: not in AidDto` — nullable, non-breaking for the plain
-- resident-facing AidDto shape.
-- aid_requests unifies the two parallel mock datasets
-- (aid_requests_store.json + mock_aid_requests.json) into one table, with
-- user_id as the ownership key that RLS uses for "own requests vs admin sees
-- all" (see 0012_rls_policies.sql).

create table aid_points (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  label text,
  status text,
  type text,
  latitude double precision not null,
  longitude double precision not null,
  geo geography(Point, 4326) generated always as (
    case when longitude is not null and latitude is not null
      then ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
    end
  ) stored,
  available_supplies text[],

  -- admin-aid "distribution point" extended fields, previously TODO/admin-only
  region text,
  manager text,
  phone text,
  remaining int,
  total int,
  inventory jsonb,          -- [{id,name,quantity,unit,expiryDate,status,active}]
  working_days int[],
  start_time text,
  end_time text,
  target_groups text[],

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index aid_points_geo_idx on aid_points using gist (geo);
create trigger trg_aid_points_updated_at before update on aid_points
  for each row execute function set_updated_at();

create table aid_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete set null,
  aid_point_id uuid references aid_points (id) on delete set null,
  aid_organization_id uuid references aid_points (id) on delete set null,
  aid_organization_name text,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'approved', 'rejected', 'fulfilled')),
  husband_name text,
  husband_id_number text,
  wife_name text,
  wife_id_number text,
  phone_number text,
  current_location text,
  female_children_count int,
  male_children_count int,
  notes text,
  requested_supplies text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index aid_requests_user_id_idx on aid_requests (user_id);
create trigger trg_aid_requests_updated_at before update on aid_requests
  for each row execute function set_updated_at();

create table aid_donors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text,
  total_amount numeric,
  last_donation timestamptz,
  donor_type text check (donor_type in ('international', 'local', 'individual', 'strategic')),
  sector text,
  contact_person text,
  email text,
  phone text,
  website text,
  country text,
  partnership_status text check (partnership_status in ('active', 'renewal', 'ended')),
  agreement_start date,
  agreement_end date,
  focus_areas text[],
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_aid_donors_updated_at before update on aid_donors
  for each row execute function set_updated_at();
