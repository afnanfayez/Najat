-- Populate the full profiles row at signup time from auth metadata, instead
-- of just full_name. The registration form's demographic fields ride along
-- in supabase.auth.signUp()'s `options.data` (see store/useRegisterStore.ts)
-- because the user isn't authenticated yet (email unconfirmed) when signUp()
-- returns, so an authenticated UPDATE against profiles isn't possible until
-- after verifyAccount() signs them in — the security-definer trigger can
-- write the whole row in one shot regardless.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, full_name, phone_number, gender, age_group, marital_status,
    health_status, national_id, housing_status, family_members_count,
    females_count, males_count, region
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone_number',
    new.raw_user_meta_data ->> 'gender',
    new.raw_user_meta_data ->> 'age_group',
    new.raw_user_meta_data ->> 'marital_status',
    new.raw_user_meta_data ->> 'health_status',
    new.raw_user_meta_data ->> 'national_id',
    new.raw_user_meta_data ->> 'housing_status',
    nullif(new.raw_user_meta_data ->> 'family_members_count', '')::int,
    nullif(new.raw_user_meta_data ->> 'females_count', '')::int,
    nullif(new.raw_user_meta_data ->> 'males_count', '')::int,
    new.raw_user_meta_data ->> 'region'
  );
  return new;
end;
$$;
