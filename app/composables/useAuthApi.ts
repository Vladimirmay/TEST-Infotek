import type { LoginRequest, LoginResponse } from '~/types'

export function useAuthApi() {
  const api = useApi()

  async function login(credentials: LoginRequest): Promise<NonNullable<LoginResponse['data']>> {
    try {
      const res = await api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: credentials
      })
      return res.data as NonNullable<LoginResponse['data']>
    } catch (error) {
      throw toApiError(error)
    }
  }

  return { login }
}
