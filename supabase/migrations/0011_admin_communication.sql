-- Admin communication. See docs/BACKEND_API_SPEC.md §6 (Admin Communication).
-- communication_counters is a singleton row (same one-row-table trick as
-- security_settings), incremented whenever a task/broadcast is created.

create table communication_counters (
  id boolean primary key default true check (id),
  total_broadcasts int not null default 0,
  total_feedback int not null default 0
);
insert into communication_counters (id) values (true);

create table communication_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  volunteer_id uuid references profiles (id) on delete set null,
  priority text,
  due_date date,
  due_time text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_communication_tasks_updated_at before update on communication_tasks
  for each row execute function set_updated_at();

create table communication_broadcasts (
  id uuid primary key default gen_random_uuid(),
  alert_type text not null,
  title text not null,
  description text,
  geographic_scope text,
  beneficiary_segment text,
  created_at timestamptz not null default now()
);

-- Derived counts (tasks.total/pending/inProgress/completed) come from a live
-- count over communication_tasks in the Route Handler rather than being
-- duplicated here — only broadcasts/feedback need the singleton counter since
-- they have no backing table of their own for "feedback" yet (spec §6: only
-- the numeric counters are live today; a full feedback table is a later
-- addition if product prioritizes it).
