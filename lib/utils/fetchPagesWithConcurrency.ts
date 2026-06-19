// Fetches pages 2..totalPages in fixed-size concurrent batches instead of all
// at once, so a slow backend isn't hit with dozens of simultaneous requests.
export async function fetchPagesWithConcurrency<T>(
  totalPages: number,
  concurrency: number,
  fetchPage: (page: number) => Promise<T>,
  startPage = 2,
): Promise<T[]> {
  const results: T[] = []
  for (let page = startPage; page <= totalPages; page += concurrency) {
    const batch = Array.from(
      { length: Math.min(concurrency, totalPages - page + 1) },
      (_, i) => fetchPage(page + i),
    )
    const settled = await Promise.allSettled(batch)
    for (const result of settled) {
      if (result.status === 'fulfilled') results.push(result.value)
    }
  }
  return results
}
