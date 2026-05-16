'use client'

import { createContext, useContext } from 'react'

export type DashboardShellValue = {
  setIsMobileMenuOpen: (open: boolean) => void
}

export const DashboardShellContext = createContext<DashboardShellValue | null>(
  null,
)

export function useDashboardShell(): DashboardShellValue | null {
  return useContext(DashboardShellContext)
}
