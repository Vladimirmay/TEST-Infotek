<script setup lang="ts">
useHead({ title: 'Книги' })

const route = useRoute()
const router = useRouter()
const booksApi = useBooksApi()

const page = computed(() => Number(route.query.page ?? 1))
const search = computed(() => typeof route.query.search === 'string' ? route.query.search : '')
const year = computed(() => route.query.year ? Number(route.query.year) : undefined)

const searchInput = ref(search.value)
const yearInput = ref<number | undefined>(year.value)

watch(search, (value) => { searchInput.value = value })
watch(year, (value) => { yearInput.value = value })

const { data, pending, error, refresh } = await useAsyncData(
  () => `books-${route.fullPath}`,
  () => booksApi.list({ page: page.value, search: search.value || undefined, year: year.value }),
  { watch: [() => route.fullPath] }
)

function applyFilters() {
  router.push({
    query: {
      ...route.query,
      page: undefined,
      search: searchInput.value || undefined,
      year: yearInput.value || undefined
    }
  })
}

function resetFilters() {
  searchInput.value = ''
  yearInput.value = undefined
  router.push({ query: {} })
}

function goToPage(next: number) {
  router.push({ query: { ...route.query, page: next } })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">Книги</h1>

    <form class="mt-4 flex flex-wrap items-end gap-3" @submit.prevent="applyFilters">
      <div>
        <label for="search" class="block text-xs font-medium text-slate-600">Поиск</label>
        <input
          id="search"
          v-model="searchInput"
          type="text"
          placeholder="Название, автор..."
          class="mt-1 w-56 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        >
      </div>

      <div>
        <label for="year" class="block text-xs font-medium text-slate-600">Год</label>
        <input
          id="year"
          v-model.number="yearInput"
          type="number"
          placeholder="2024"
          class="mt-1 w-28 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        >
      </div>

      <button
        type="submit"
        class="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Найти
      </button>
      <button
        type="button"
        class="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700"
        @click="resetFilters"
      >
        Сбросить
      </button>
    </form>

    <div v-if="pending" class="mt-8 text-sm text-slate-500">
      Загрузка...
    </div>

    <div v-else-if="error" class="mt-8 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Не удалось загрузить книги.
      <button type="button" class="ml-2 underline" @click="refresh()">Повторить</button>
    </div>

    <div v-else-if="!data?.items.length" class="mt-8 text-sm text-slate-500">
      Ничего не найдено.
    </div>

    <div v-else class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <BookCard v-for="book in data.items" :key="book.id" :book="book" />
    </div>

    <PaginationBar v-if="data?.pagination" :pagination="data.pagination" @change="goToPage" />
  </div>
</template>
