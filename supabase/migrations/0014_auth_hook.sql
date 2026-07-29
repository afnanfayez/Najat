-- Custom Access Token Hook: writes profiles.role into the JWT's app_metadata
-- at token mint/refresh time, so middleware.ts and every RLS policy (is_admin())
-- can read `role` for free from the already-verified session — no extra
-- Postgres round trip from Edge Middleware. See the migration plan Phase 2.
--
-- This migration only creates the function + grants. The hook itself still
-- needs to be switched on in the Supabase dashboard (Authentication -> Hooks
-- -> "Customize Access Token (JWT) Claims hook" -> select
-- public.custom_access_token_hook) since pushing supabase/config.toml wholesale
-- to the hosted project would also overwrite unrelated live auth settings
-- (site_url, rate limits, etc.) with this repo's local-dev placeholder values.

create or replace function custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_role text;
begin
  select role into user_role from public.profiles where id = (event ->> 'user_id')::uuid;

  claims := event -> 'claims';

  if user_role is not null then
    claims := jsonb_set(claims, '{app_metadata,role}', to_jsonb(user_role));
  end if;

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;

grant select on public.profiles to supabase_auth_admin;
create policy profiles_auth_admin_read on public.profiles
  as permissive for select to supabase_auth_admin using (true);
