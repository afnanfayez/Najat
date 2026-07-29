-- Safety map: danger_zones, safe_roads, resource_points. See
-- docs/BACKEND_API_SPEC.md §8, §12.6. Real PostGIS geometry, replacing the
-- mock's bounding-box approximation with true ST_Contains/ST_DWithin.
-- Wire format stays GeoJSON in/out (ST_AsGeoJSON/ST_GeomFromGeoJSON at the
-- Route Handler boundary) — this is purely an internal representation change.

create table danger_zones (
  id uuid primary key default gen_random_uuid(),
  description text not null default '',
  danger_level text not null check (danger_level in ('low', 'medium', 'high', 'critical')),
  area geography(Polygon, 4326) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index danger_zones_area_idx on danger_zones using gist (area);
create trigger trg_danger_zones_updated_at before update on danger_zones
  for each row execute function set_updated_at();

create table safe_roads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  path geography(LineString, 4326) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index safe_roads_path_idx on safe_roads using gist (path);
create trigger trg_safe_roads_updated_at before update on safe_roads
  for each row execute function set_updated_at();

create table resource_points (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  location geography(Point, 4326) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index resource_points_location_idx on resource_points using gist (location);
create trigger trg_resource_points_updated_at before update on resource_points
  for each row execute function set_updated_at();
