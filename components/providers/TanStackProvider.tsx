'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        // Run queryFn even while offline (instead of pausing) so our SW /
        // IndexedDB cache fallbacks can serve data — otherwise offline queries
        // stay stuck in a perpetual "loading" state.
        networkMode: 'offlineFirst',
        retry: (failureCount) => {
          if (typeof navigator !== 'undefined' && !navigator.onLine) {
            return false
          }
          return failureCount < 1
        },
        refetchOnWindowFocus: false,
      },
    },
  })
}

export default function TanStackProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
