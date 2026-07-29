-- Fixes "column reference \"id\" is ambiguous" in update_danger_zone: the
-- function's own `returns table(id uuid, ...)` declares an implicit `id`
-- variable in the plpgsql function's scope, which shadowed the bare `id`
-- column reference in the UPDATE's WHERE clause. Qualify with the table name.

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
    description = coalesce(p_description, danger_zones.description),
    danger_level = coalesce(p_danger_level, danger_zones.danger_level),
    area = case when p_area is not null
             then ST_SetSRID(ST_GeomFromGeoJSON(p_area::text), 4326)::geography
             else danger_zones.area end,
    is_active = coalesce(p_is_active, danger_zones.is_active),
    updated_at = now()
  where danger_zones.id = zone_id;
  return query select * from get_danger_zone(zone_id);
end;
$$;
