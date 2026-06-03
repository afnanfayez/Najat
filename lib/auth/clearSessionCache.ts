import type { QueryClient } from '@tanstack/react-query'

export function clearUserSessionCache(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: ['profile'] })
  queryClient.removeQueries({ queryKey: ['profile', 'me'] })
}
