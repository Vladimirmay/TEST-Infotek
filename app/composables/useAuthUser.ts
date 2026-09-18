import type { AuthUser } from '~/types'

export function useAuthUser() {
  return useCookie<AuthUser | null>('auth_user', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  })
}
