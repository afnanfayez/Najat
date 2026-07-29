-- Generic "nearby" query backing GET /v1/{resource}/nearby for every table
-- with a generated `geo` geography column (hospitals, pharmacies, labs,
-- clinics, dental_clinics, aid_points — see 0004_health_facilities.sql,
-- 0005_aid.sql). Runs as SECURITY INVOKER (the default) so it still respects
-- each table's RLS policies — this is not a privilege-escalation path.
--
-- Returns jsonb rows (not a typed table) so one function works generically
-- across tables with different columns; the Route Handler layer converts
-- row_data's snake_case keys to camelCase like any other query result.

create or replace function nearby_geo(
  table_name text,
  origin_lat double precision,
  origin_lng double precision,
  radius_m double precision,
  page_offset int,
  page_size int
)
returns table (row_data jsonb, distance double precision, total_count bigint)
language plpgsql
stable
as $$
begin
  return query execute format(
    'select to_jsonb(t.*) as row_data,
            ST_Distance(t.geo, ST_SetSRID(ST_MakePoint($1,$2),4326)::geography) as distance,
            count(*) over() as total_count
       from %I t
      where t.geo is not null
        and t.deleted_at is null
        and ST_DWithin(t.geo, ST_SetSRID(ST_MakePoint($1,$2),4326)::geography, $3)
      order by distance asc
      offset $4 limit $5',
    table_name
  ) using origin_lng, origin_lat, radius_m, page_offset, page_size;
end;
$$;

grant execute on function nearby_geo to anon, authenticated;
