-- Safety map: GeoJSON <-> geography conversion RPCs. PostgREST's default
-- serialization of a `geography` column is not reliable GeoJSON, so every
-- read/write for danger_zones/safe_roads/resource_points goes through one of
-- these functions instead of a raw select/insert on the table — mirrors the
-- nearby_geo() approach in 0017_nearby_rpc.sql. See
-- docs/BACKEND_API_SPEC.md §8, §12.6 and the migration plan Phase 4.

-- ── Danger zones (full CRUD except status-only; geometry effectively
--    immutable via the UI but the RPC still accepts an update for it) ──

create or replace function list_danger_zones(page_offset int, page_size int)
returns table (
  id uuid, description text, danger_level text, area jsonb, is_active boolean,
  created_at timestamptz, updated_at timestamptz, deleted_at timestamptz, total_count bigint
)
language sql stable
as $$
  select z.id, z.description, z.danger_level, ST_AsGeoJSON(z.area)::jsonb,
         z.is_active, z.created_at, z.updated_at, z.deleted_at,
         count(*) over() as total_count
    from danger_zones z
   where z.deleted_at is null
   order by z.created_at desc
   offset page_offset limit page_size
$$;

create or replace function get_danger_zone(zone_id uuid)
returns table (
  id uuid, description text, danger_level text, area jsonb, is_active boolean,
  created_at timestamptz, updated_at timestamptz, deleted_at timestamptz
)
language sql stable
as $$
  select z.id, z.description, z.danger_level, ST_AsGeoJSON(z.area)::jsonb,
         z.is_active, z.created_at, z.updated_at, z.deleted_at
    from danger_zones z
   where z.id = zone_id
$$;

create or replace function create_danger_zone(
  p_description text, p_danger_level text, p_area jsonb, p_is_active boolean default true
)
returns table (
  id uuid, description text, danger_level text, area jsonb, is_active boolean,
  created_at timestamptz, updated_at timestamptz, deleted_at timestamptz
)
language plpgsql
as $$
declare new_id uuid;
begin
  insert into danger_zones (description, danger_level, area, is_active)
  values (
    p_description, p_danger_level,
    ST_SetSRID(ST_GeomFromGeoJSON(p_area::text), 4326)::geography,
    coalesce(p_is_active, true)
  )
  returning danger_zones.id into new_id;
  return query select * from get_danger_zone(new_id);
end;
$$;

create or replace function update_danger_zone(
  zone_id uuid, p_description text default null, p_danger_level text default null,
  p_area jsonb default null, p_is_active boolean default null
)
returns table (
  id uuid, description text, danger_level text, area jsonb, is_active boolean,
  created_at timestamptz, updated_at timestamptz, deleted_at timestamptz
)
language plpgsql
as $$
begin
  update danger_zones set
    description = coalesce(p_description, description),
    danger_level = coalesce(p_danger_level, danger_level),
    area = case when p_area is not null
             then ST_SetSRID(ST_GeomFromGeoJSON(p_area::text), 4326)::geography
             else area end,
    is_active = coalesce(p_is_active, is_active),
    updated_at = now()
  where id = zone_id;
  return query select * from get_danger_zone(zone_id);
end;
$$;

-- ── Safe roads (create + delete only per spec §8 — read only via
--    safety_map_data(); no list/get/update endpoint documented) ──

create or replace function create_safe_road(
  p_name text, p_description text, p_path jsonb, p_is_active boolean default true
)
returns table (
  id uuid, name text, description text, path jsonb, is_active boolean,
  created_at timestamptz, updated_at timestamptz, deleted_at timestamptz
)
language plpgsql
as $$
declare new_id uuid;
begin
  insert into safe_roads (name, description, path, is_active)
  values (
    p_name, coalesce(p_description, ''),
    ST_SetSRID(ST_GeomFromGeoJSON(p_path::text), 4326)::geography,
    coalesce(p_is_active, true)
  )
  returning safe_roads.id into new_id;
  return query
    select r.id, r.name, r.description, ST_AsGeoJSON(r.path)::jsonb, r.is_active,
           r.created_at, r.updated_at, r.deleted_at
      from safe_roads r where r.id = new_id;
end;
$$;

-- ── Resource points (create + delete only per spec §8 — same as safe roads) ──

create or replace function create_resource_point(
  p_name text, p_type text, p_location jsonb, p_is_active boolean default true
)
returns table (
  id uuid, name text, type text, location jsonb, is_active boolean,
  created_at timestamptz, updated_at timestamptz, deleted_at timestamptz
)
language plpgsql
as $$
declare new_id uuid;
begin
  insert into resource_points (name, type, location, is_active)
  values (
    p_name, p_type,
    ST_SetSRID(ST_GeomFromGeoJSON(p_location::text), 4326)::geography,
    coalesce(p_is_active, true)
  )
  returning resource_points.id into new_id;
  return query
    select p.id, p.name, p.type, ST_AsGeoJSON(p.location)::jsonb, p.is_active,
           p.created_at, p.updated_at, p.deleted_at
      from resource_points p where p.id = new_id;
end;
$$;

-- ── Combined map-data (all 3 layers at once, GET /v1/safety/map-data) ──

create or replace function safety_map_data()
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'dangerZones', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', z.id, 'description', z.description, 'dangerLevel', z.danger_level,
        'area', ST_AsGeoJSON(z.area)::jsonb, 'isActive', z.is_active,
        'createdAt', z.created_at, 'updatedAt', z.updated_at, 'deletedAt', z.deleted_at
      )), '[]'::jsonb)
      from danger_zones z where z.deleted_at is null
    ),
    'safeRoads', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', r.id, 'name', r.name, 'description', r.description,
        'path', ST_AsGeoJSON(r.path)::jsonb, 'isActive', r.is_active,
        'createdAt', r.created_at, 'updatedAt', r.updated_at, 'deletedAt', r.deleted_at
      )), '[]'::jsonb)
      from safe_roads r where r.deleted_at is null
    ),
    'resourcePoints', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', p.id, 'name', p.name, 'type', p.type,
        'location', ST_AsGeoJSON(p.location)::jsonb, 'isActive', p.is_active,
        'createdAt', p.created_at, 'updatedAt', p.updated_at, 'deletedAt', p.deleted_at
      )), '[]'::jsonb)
      from resource_points p where p.deleted_at is null
    )
  )
$$;

-- ── Point-in-polygon check, GET /v1/safety/check?lat&lng — replaces the
--    mock's bounding-box approximation with a real ST_Contains test. ──

create or replace function safety_check(p_lat double precision, p_lng double precision)
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'safe', not exists (
      select 1 from danger_zones z
       where z.deleted_at is null and z.is_active
         and ST_Contains(z.area::geometry, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326))
    ),
    'zones', coalesce((
      select jsonb_agg(jsonb_build_object('description', z.description, 'dangerLevel', z.danger_level))
        from danger_zones z
       where z.deleted_at is null and z.is_active
         and ST_Contains(z.area::geometry, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326))
    ), '[]'::jsonb)
  )
$$;

grant execute on function list_danger_zones, get_danger_zone, create_danger_zone,
  update_danger_zone, create_safe_road, create_resource_point, safety_map_data,
  safety_check to anon, authenticated;
