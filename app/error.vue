<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error.statusCode === 404)

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
    <div>
      <p class="text-sm font-medium text-blue-600">{{ error.statusCode }}</p>
      <h1 class="mt-2 text-2xl font-semibold text-slate-900">
        {{ isNotFound ? 'Страница не найдена' : 'Что-то пошло не так' }}
      </h1>
      <p class="mt-2 text-sm text-slate-500">
        {{ isNotFound ? 'Такой страницы в каталоге книг нет.' : (error.statusMessage || error.message) }}
      </p>
      <button
        type="button"
        class="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        @click="goHome"
      >
        На главную
      </button>
    </div>
  </div>
</template>
