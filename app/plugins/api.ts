export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const token = useAuthToken()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
    },
    onResponse({ response }) {
      if (response.status === 401) {
        token.value = null
      }
    }
  })

  return {
    provide: { api }
  }
})
