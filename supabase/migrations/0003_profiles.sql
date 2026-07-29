-- profiles: 1:1 with auth.users. See docs/BACKEND_API_SPEC.md §1, §7.
-- Includes fields that were "local-only" in the mock layer (avatar/assistance*/
-- emergencyContacts/sosMessage/bloodType) — now persisted server-side for real.

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role text not null default 'resident' check (role in ('resident', 'volunteer', 'admin')),

  phone_number text,
  gender text check (gender in ('male', 'female')),
  age_group text check (age_group in ('18-40', 'above 40')),
  marital_status text check (marital_status in ('single', 'married', 'divorced', 'widowed')),
  health_status text check (health_status in ('Healthy', 'Chronically Ill', 'Injured', 'Amputee')),
  national_id text check (national_id is null or national_id ~ '^\d{9}$'),
  housing_status text,
  family_members_count int,
  females_count int,
  males_count int,
  region text,

  is_verified boolean not null default false,
  is_active boolean not null default true,

  -- previously local-only (device storage); now first-class, server-persisted
  avatar_url text,
  assistance_preferences jsonb,   -- {food,medicine,water,clothes,health,transport}: boolean
  assistance_location text,
  assistance_radius numeric,
  emergency_contacts jsonb,       -- Array<{id, name, phone}>
  sos_message text,
  blood_type text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row on every Supabase Auth signup.
-- role defaults to 'resident'; admin/volunteer roles are set afterward via an
-- admin-only update (matches how QA seed accounts get their fixed roles).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
