-- Extensions required by the schema.
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists postgis;    -- geography/geometry columns, ST_* functions
