-- nearby_geo() should not leak the internal `geo` generated geography column
-- (raw WKB) into API responses — strip it from the returned jsonb.
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
    'select (to_jsonb(t.*) - ''geo'') as row_data,
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
