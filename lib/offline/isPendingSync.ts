/** Optimistic records created offline share the `offline-<timestamp>` temp-id scheme until the sync queue reconciles them with the server's real id. */
export function isPendingSyncId(id: string): boolean {
  return id.startsWith('offline-')
}
