-- Adds an optional `type_filter` for GET /v1/providers/nearby?type=... — only
-- the `providers` view has a `type` column, so the filter clause is only
-- spliced into the dynamic SQL when a caller actually passes one (keeps this
-- generic RPC safe to call for every other nearby-enabled table, none of
-- which have a `type` column of their own).
create or replace function nearby_geo(
  table_name text,
  origin_lat double precision,
  origin_lng double precision,
  radius_m double precision,
  page_offset int,
  page_size int,
  type_filter text default null
)
returns table (row_data jsonb, distance double precision, total_count bigint)
language plpgsql
stable
as $$
declare
  type_clause text := '';
begin
  if type_filter is not null then
    type_clause := format(' and t.type = %L', type_filter);
  end if;

  return query execute format(
    'select (to_jsonb(t.*) - ''geo'') as row_data,
            ST_Distance(t.geo, ST_SetSRID(ST_MakePoint($1,$2),4326)::geography) as distance,
            count(*) over() as total_count
       from %I t
      where t.geo is not null
        and t.deleted_at is null
        and ST_DWithin(t.geo, ST_SetSRID(ST_MakePoint($1,$2),4326)::geography, $3)%s
      order by distance asc
      offset $4 limit $5',
    table_name, type_clause
  ) using origin_lng, origin_lat, radius_m, page_offset, page_size;
end;
$$;
