<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const authorsApi = useAuthorsApi()
const id = computed(() => Number(route.params.id))

const { data: author, pending, error } = await useAsyncData(
  () => `author-${id.value}`,
  () => authorsApi.get(id.value),
  { watch: [id] }
)

useHead({ title: () => author.value?.full_name ?? 'Автор' })

const deleting = ref(false)
const deleteError = ref('')

async function onDelete() {
  if (!author.value) return
  if (!confirm(`Удалить автора «${author.value.full_name}»?`)) return

  deleting.value = true
  deleteError.value = ''
  try {
    await authorsApi.remove(id.value)
    await router.push('/authors')
  } catch (error) {
    deleteError.value = toApiError(error).message
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <NuxtLink to="/authors" class="text-sm text-blue-600 hover:underline">
      ← К списку авторов
    </NuxtLink>

    <div v-if="pending" class="mt-6 text-sm text-slate-500">
      Загрузка...
    </div>

    <div v-else-if="error" class="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Автор не найден.
    </div>

    <div v-else-if="author" class="mt-6">
      <h1 class="text-2xl font-semibold">{{ author.full_name }}</h1>

      <div v-if="auth.isAuthenticated" class="mt-4 flex gap-3">
        <NuxtLink
          :to="`/authors/${id}/edit`"
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

      <h2 class="mt-8 text-lg font-medium text-slate-800">Книги автора</h2>
      <ul v-if="author.books?.length" class="mt-3 space-y-2">
        <li v-for="book in author.books" :key="book.id">
          <NuxtLink :to="`/books/${book.id}`" class="text-blue-600 hover:underline">
            {{ book.title }}
          </NuxtLink>
          <span class="text-sm text-slate-500"> ({{ book.year }})</span>
        </li>
      </ul>
      <p v-else class="mt-3 text-sm text-slate-500">У автора пока нет книг в каталоге.</p>

      <AuthorSubscribeForm v-if="!auth.isAuthenticated" class="mt-8 max-w-md" :author-id="id" />
    </div>
  </div>
</template>
