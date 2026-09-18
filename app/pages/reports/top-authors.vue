<script setup lang="ts">
useHead({ title: 'Топ авторов' })

const route = useRoute()
const router = useRouter()
const reportsApi = useReportsApi()

const currentYear = new Date().getFullYear()
const year = computed(() => route.query.year ? Number(route.query.year) : currentYear)
const yearInput = ref(year.value)

watch(year, (value) => { yearInput.value = value })

const { data, pending, error, refresh } = await useAsyncData(
  () => `top-authors-${year.value}`,
  () => reportsApi.topAuthors(year.value),
  { watch: [year] }
)

function applyYear() {
  router.push({ query: { year: yearInput.value } })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">Топ-10 авторов по году</h1>
    <p class="mt-1 text-sm text-slate-500">Авторы, выпустившие больше всего книг за выбранный год.</p>

    <form class="mt-4 flex items-end gap-3" @submit.prevent="applyYear">
      <div>
        <label for="year" class="block text-xs font-medium text-slate-600">Год</label>
        <input
          id="year"
          v-model.number="yearInput"
          type="number"
          required
          class="mt-1 w-28 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        >
      </div>
      <button
        type="submit"
        class="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Показать
      </button>
    </form>

    <div v-if="pending" class="mt-8 text-sm text-slate-500">
      Загрузка...
    </div>

    <div v-else-if="error" class="mt-8 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Не удалось загрузить отчёт.
      <button type="button" class="ml-2 underline" @click="refresh()">Повторить</button>
    </div>

    <div v-else-if="!data?.length" class="mt-8 text-sm text-slate-500">
      За {{ year }} год данных нет.
    </div>

    <div v-else class="mt-6 overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 text-slate-500">
            <th class="py-2 pr-4 font-medium">#</th>
            <th class="py-2 pr-4 font-medium">Автор</th>
            <th class="py-2 font-medium">Книг за {{ year }} год</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.author_id" class="border-b border-slate-100">
            <td class="py-2 pr-4 text-slate-500">{{ item.rank }}</td>
            <td class="py-2 pr-4">
              <NuxtLink :to="`/authors/${item.author_id}`" class="text-blue-600 hover:underline">
                {{ item.full_name }}
              </NuxtLink>
            </td>
            <td class="py-2">{{ item.books_count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
