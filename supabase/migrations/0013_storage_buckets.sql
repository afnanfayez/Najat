-- Storage buckets replacing the mock's inline-base64-in-record image handling.
-- See docs/BACKEND_API_SPEC.md §0, §12.5 and the migration plan Phase 3.

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('facility-images', 'facility-images', true),
  ('article-images', 'article-images', true)
on conflict (id) do nothing;

-- avatars: public read, write restricted to the user's own folder
-- (path convention: avatars/<user_id>/<uuid>.<ext>)
create policy avatars_public_read on storage.objects
  for select using (bucket_id = 'avatars');
create policy avatars_own_write on storage.objects
  for insert with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy avatars_own_update on storage.objects
  for update using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy avatars_own_delete on storage.objects
  for delete using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- facility-images / article-images: public read, admin-only write
-- (facility/article creation is an admin-only action in the current app)
create policy facility_images_public_read on storage.objects
  for select using (bucket_id = 'facility-images');
create policy facility_images_admin_write on storage.objects
  for insert with check (bucket_id = 'facility-images' and is_admin());
create policy facility_images_admin_update on storage.objects
  for update using (bucket_id = 'facility-images' and is_admin());
create policy facility_images_admin_delete on storage.objects
  for delete using (bucket_id = 'facility-images' and is_admin());

create policy article_images_public_read on storage.objects
  for select using (bucket_id = 'article-images');
create policy article_images_admin_write on storage.objects
  for insert with check (bucket_id = 'article-images' and is_admin());
create policy article_images_admin_update on storage.objects
  for update using (bucket_id = 'article-images' and is_admin());
create policy article_images_admin_delete on storage.objects
  for delete using (bucket_id = 'article-images' and is_admin());
