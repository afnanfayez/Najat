-- Volunteer task interface: lets a volunteer read the tasks an admin assigned
-- to them and advance their status.
--
-- communication_tasks already models the admin -> volunteer link (0011) and
-- admins already create rows against it, but 0012 locked the table down with
-- `communication_tasks_admin_only`, so a volunteer could not read their own
-- assignments at all. That is why /volunteer renders hardcoded demo data.
--
-- Scope guard: a volunteer may only ever SEE rows assigned to them, and may
-- only change `status`. Title, description, priority, due date and — critically
-- — volunteer_id stay admin-owned, so a volunteer cannot reassign a task to
-- themselves or anyone else.

-- Mirrors is_admin() (0002_helpers.sql): reads the role claim the Custom Access
-- Token Hook writes into app_metadata, so there is no round trip to profiles.
create or replace function is_volunteer()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'volunteer', false)
$$;

-- The existing admin-only policy is FOR ALL, which already covers admins. Add
-- volunteer-scoped select/update alongside it (policies are permissive: a row
-- is visible if ANY policy allows it).
create policy communication_tasks_volunteer_select on communication_tasks
  for select using (is_volunteer() and volunteer_id = auth.uid());

create policy communication_tasks_volunteer_update on communication_tasks
  for update
  using (is_volunteer() and volunteer_id = auth.uid())
  with check (is_volunteer() and volunteer_id = auth.uid());

-- USING/WITH CHECK cannot express "only the status column may change", so pin
-- the immutable columns with a trigger. Without this a volunteer could PATCH
-- title/priority/volunteer_id through the same PostgREST update.
create or replace function enforce_volunteer_task_scope()
returns trigger
language plpgsql
as $$
begin
  if is_admin() then
    return new;
  end if;

  if new.title is distinct from old.title
     or new.description is distinct from old.description
     or new.volunteer_id is distinct from old.volunteer_id
     or new.priority is distinct from old.priority
     or new.due_date is distinct from old.due_date
     or new.due_time is distinct from old.due_time then
    raise exception 'volunteers may only change task status';
  end if;

  return new;
end;
$$;

create trigger trg_communication_tasks_volunteer_scope
  before update on communication_tasks
  for each row execute function enforce_volunteer_task_scope();

-- The volunteer task list is always "my tasks, newest first".
create index if not exists communication_tasks_volunteer_id_idx
  on communication_tasks (volunteer_id, created_at desc);
