import { createBucketStore } from '@/lib/mocks/store/localStore'
import { seedUsers, type MockUserRecord } from '@/lib/mocks/seeds/users.seed'

/** Shared user directory backing both auth (login/register) and admin Users management. */
export const usersStore = createBucketStore<MockUserRecord>('users', 1, seedUsers)

export function findUserByEmail(email: string): MockUserRecord | undefined {
  const key = email.trim().toLowerCase()
  return usersStore.getAll().find((u) => u.email.toLowerCase() === key)
}

export function findUserById(id: string): MockUserRecord | undefined {
  return usersStore.getAll().find((u) => u.id === id)
}

export function upsertUser(updated: MockUserRecord): void {
  const all = usersStore.getAll()
  const idx = all.findIndex((u) => u.id === updated.id)
  if (idx === -1) {
    usersStore.setAll([...all, updated])
  } else {
    const next = [...all]
    next[idx] = updated
    usersStore.setAll(next)
  }
}

export function stripPassword(user: MockUserRecord): Omit<MockUserRecord, 'password'> {
  const { password: _password, ...rest } = user
  return rest
}
