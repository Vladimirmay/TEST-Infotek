<script setup lang="ts">
import type { BookFormData } from '~/types'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const booksApi = useBooksApi()
const id = computed(() => Number(route.params.id))

const { data: book, pending, error: loadError } = await useAsyncData(
  () => `book-edit-${id.value}`,
  () => booksApi.get(id.value)
)

useHead({ title: () => book.value ? `Редактирование: ${book.value.title}` : 'Редактирование книги' })

const submitting = ref(false)
const serverError = ref<ApiRequestError | null>(null)

async function onSubmit(data: BookFormData) {
  submitting.value = true
  serverError.value = null
  try {
    if (data.cover) {
      await booksApi.update(id.value, data)
    } else {
      await booksApi.patch(id.value, {
        title: data.title,
        year: data.year,
        description: data.description,
        isbn: data.isbn,
        author_ids: data.author_ids
      })
    }
    await router.push(`/books/${id.value}`)
  } catch (error) {
    serverError.value = toApiError(error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <NuxtLink :to="`/books/${id}`" class="text-sm text-blue-600 hover:underline">
      ← К книге
    </NuxtLink>

    <h1 class="mt-4 text-2xl font-semibold">Редактирование книги</h1>

    <div v-if="pending" class="mt-6 text-sm text-slate-500">
      Загрузка...
    </div>

    <div v-else-if="loadError" class="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Книга не найдена.
    </div>

    <BookForm
      v-else-if="book"
      class="mt-6"
      :initial-book="book"
      :submitting="submitting"
      :server-error="serverError"
      @submit="onSubmit"
    />
  </div>
</template>
