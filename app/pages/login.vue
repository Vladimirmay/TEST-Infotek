<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

useHead({ title: 'Вход' })

if (auth.isAuthenticated) {
  await navigateTo('/')
}

const username = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

async function onSubmit() {
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    await auth.login({ username: username.value, password: password.value })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await navigateTo(redirect)
  } catch (error) {
    errorMessage.value = error instanceof ApiRequestError
      ? error.message
      : 'Не удалось войти. Попробуйте ещё раз.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-sm">
    <h1 class="text-2xl font-semibold">Вход</h1>

    <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
      <div>
        <label for="username" class="block text-sm font-medium text-slate-700">Логин</label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          autocomplete="username"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-slate-700">Пароль</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
      </div>

      <p v-if="errorMessage" class="text-sm text-red-600">
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {{ isSubmitting ? 'Входим...' : 'Войти' }}
      </button>
    </form>
  </div>
</template>
