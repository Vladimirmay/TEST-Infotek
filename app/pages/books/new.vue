<script setup lang="ts">
import type { BookFormData } from '~/types'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Новая книга' })

const router = useRouter()
const booksApi = useBooksApi()

const submitting = ref(false)
const serverError = ref<ApiRequestError | null>(null)

async function onSubmit(data: BookFormData) {
  submitting.value = true
  serverError.value = null
  try {
    const book = await booksApi.create(data)
    await router.push(`/books/${book.id}`)
  } catch (error) {
    serverError.value = toApiError(error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <NuxtLink to="/" class="text-sm text-blue-600 hover:underline">
      ← К списку книг
    </NuxtLink>

    <h1 class="mt-4 text-2xl font-semibold">Новая книга</h1>

    <BookForm
      class="mt-6"
      :submitting="submitting"
      :server-error="serverError"
      @submit="onSubmit"
    />
  </div>
</template>
