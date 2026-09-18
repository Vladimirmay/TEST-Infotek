<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const booksApi = useBooksApi()
const id = computed(() => Number(route.params.id))

const { data: book, pending, error } = await useAsyncData(
  () => `book-${id.value}`,
  () => booksApi.get(id.value),
  { watch: [id] }
)

useHead({ title: () => book.value?.title ?? 'Книга' })

const deleting = ref(false)
const deleteError = ref('')

async function onDelete() {
  if (!book.value) return
  if (!confirm(`Удалить книгу «${book.value.title}»?`)) return

  deleting.value = true
  deleteError.value = ''
  try {
    await booksApi.remove(id.value)
    await router.push('/')
  } catch (error) {
    deleteError.value = toApiError(error).message
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <NuxtLink to="/" class="text-sm text-blue-600 hover:underline">
      ← К списку книг
    </NuxtLink>

    <div v-if="pending" class="mt-6 text-sm text-slate-500">
      Загрузка...
    </div>

    <div v-else-if="error" class="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Книга не найдена.
    </div>

    <div v-else-if="book" class="mt-6 flex flex-col gap-6 sm:flex-row">
      <div class="h-64 w-44 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <img
          v-if="book.cover_url"
          :src="book.cover_url"
          :alt="book.title"
          class="h-full w-full object-cover"
        >
        <div v-else class="flex h-full w-full items-center justify-center text-sm text-slate-400">
          Нет обложки
        </div>
      </div>

      <div class="min-w-0">
        <h1 class="text-2xl font-semibold">{{ book.title }}</h1>
        <p class="mt-1 text-slate-500">{{ book.year }}</p>

        <p class="mt-3 text-sm text-slate-600">
          <span class="mr-1 font-medium text-slate-700">Авторы:</span>
          <template v-if="book.authors?.length">
            <NuxtLink
              v-for="(author, index) in book.authors"
              :key="author.id"
              :to="`/authors/${author.id}`"
              class="text-blue-600 hover:underline"
            >
              {{ author.full_name }}<span v-if="index < book.authors.length - 1">, </span>
            </NuxtLink>
          </template>
          <span v-else>не указаны</span>
        </p>

        <p v-if="book.isbn" class="mt-1 text-sm text-slate-600">
          <span class="font-medium text-slate-700">ISBN:</span> {{ book.isbn }}
        </p>

        <p v-if="book.description" class="mt-4 whitespace-pre-line text-sm text-slate-700">
          {{ book.description }}
        </p>

        <div v-if="auth.isAuthenticated" class="mt-6 flex gap-3">
          <NuxtLink
            :to="`/books/${id}/edit`"
            class="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            Редактировать
          </NuxtLink>
          <button
            type="button"
            :disabled="deleting"
            class="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            @click="onDelete"
          >
            {{ deleting ? 'Удаляем...' : 'Удалить' }}
          </button>
        </div>
        <p v-if="deleteError" class="mt-2 text-sm text-red-600">{{ deleteError }}</p>
      </div>
    </div>
  </div>
</template>
