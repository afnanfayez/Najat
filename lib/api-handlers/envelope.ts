import { NextResponse } from 'next/server'

/** Single-item response envelope — see docs/BACKEND_API_SPEC.md §12.1. */
export function envelope<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, statusCode: status, data, timestamp: new Date().toISOString() }, { status })
}

export function errorEnvelope(message: string, status = 400, errors: unknown = null) {
  return NextResponse.json(
    { success: false, statusCode: status, message, errors, timestamp: new Date().toISOString() },
    { status },
  )
}

/** Paginated list response envelope — see docs/BACKEND_API_SPEC.md §12.1. */
export function listEnvelope<T>(data: T[], meta: object, status = 200) {
  return NextResponse.json(
    { success: true, statusCode: status, data, meta, timestamp: new Date().toISOString() },
    { status },
  )
}
