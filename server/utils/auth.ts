import type { H3Event } from 'h3'
import type { DbUser } from './db'

const tokens = new Map<string, DbUser>()

export function issueToken(user: DbUser): string {
  const token = `mock-${user.id}-${Math.random().toString(36).slice(2)}`
  tokens.set(token, user)
  return token
}

export function getAuthUser(event: H3Event): DbUser | null {
  const header = getHeader(event, 'authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
  if (!token) return null
  return tokens.get(token) ?? null
}
