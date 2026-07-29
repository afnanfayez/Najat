/**
 * Top-level camelCase <-> snake_case key translation at the Route Handler
 * boundary. Only translates top-level keys — nested jsonb blobs (e.g.
 * workingDoctors, inventory) are stored and returned exactly as authored,
 * matching the seed data and existing frontend DTOs. See
 * docs/BACKEND_API_SPEC.md migration plan, Phase 4.
 */

function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function snakeToCamel(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase())
}

export function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[camelToSnake(key)] = value
  }
  return result
}

export function toCamelCase<T = Record<string, unknown>>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[snakeToCamel(key)] = value
  }
  return result as T
}
