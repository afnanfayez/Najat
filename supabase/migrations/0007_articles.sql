-- Articles / Health Guide. See docs/BACKEND_API_SPEC.md §9.
-- `references_text` is a first-class column, replacing the mock's
-- `\n\n---REFERENCES---\n` sentinel hack inside contentAr.

create table articles (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text,
  content_ar text not null default '',
  content_en text,
  category text not null check (category in ('first-aid', 'awareness', 'mental-health')),
  image text,
  read_time int not null default 0,
  views_count int not null default 0,
  is_active boolean not null default true,
  author_id uuid references profiles (id) on delete set null,
  references_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create trigger trg_articles_updated_at before update on articles
  for each row execute function set_updated_at();
