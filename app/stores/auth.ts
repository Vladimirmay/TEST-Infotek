import type { LoginRequest } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const token = useAuthToken()
  const user = useAuthUser()

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: LoginRequest) {
    const { login: loginRequest } = useAuthApi()
    const data = await loginRequest(credentials)
    token.value = data.token ?? null
    user.value = data.user ?? null
  }

  function logout() {
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, login, logout }
})
