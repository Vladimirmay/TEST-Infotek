<script setup lang="ts">
import type { Book, BookFormData } from '~/types'

const props = defineProps<{
  initialBook?: Book | null
  submitting?: boolean
  serverError?: ApiRequestError | null
}>()

const emit = defineEmits<{ submit: [data: BookFormData] }>()

const authorsApi = useAuthorsApi()
const { data: authorsData } = await useAsyncData(
  'book-form-authors',
  () => authorsApi.list({ perPage: 100 })
)
const authorOptions = computed(() => authorsData.value?.items ?? [])

const title = ref(props.initialBook?.title ?? '')
const year = ref<number | undefined>(props.initialBook?.year)
const description = ref(props.initialBook?.description ?? '')
const isbn = ref(props.initialBook?.isbn ?? '')
const selectedAuthorIds = ref<number[]>(
  props.initialBook?.authors?.map(a => a.id).filter((id): id is number => id != null) ?? []
)
const coverFile = ref<File | null>(null)
const coverPreviewUrl = ref<string | null>(props.initialBook?.cover_url ?? null)
const localError = ref('')

function onCoverChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  coverFile.value = file
  coverPreviewUrl.value = file ? URL.createObjectURL(file) : (props.initialBook?.cover_url ?? null)
}

function onSubmit() {
  localError.value = ''

  if (!props.initialBook && !coverFile.value) {
    localError.value = 'Загрузите обложку книги'
    return
  }
  if (!selectedAuthorIds.value.length) {
    localError.value = 'Выберите хотя бы одного автора'
    return
  }

  emit('submit', {
    title: title.value,
    year: year.value as number,
    description: description.value || undefined,
    isbn: isbn.value || undefined,
    author_ids: selectedAuthorIds.value,
    cover: coverFile.value
  })
}

function fieldError(field: string) {
  return props.serverError?.fieldError(field)
}
</script>

<template>
  <form class="max-w-xl space-y-4" @submit.prevent="onSubmit">
    <div>
      <label for="title" class="block text-sm font-medium text-slate-700">Название</label>
      <input
        id="title"
        v-model="title"
        type="text"
        required
        class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
      <p v-if="fieldError('title')" class="mt-1 text-sm text-red-600">{{ fieldError('title') }}</p>
    </div>

    <div>
      <label for="year" class="block text-sm font-medium text-slate-700">Год выпуска</label>
      <input
        id="year"
        v-model.number="year"
        type="number"
        required
        class="mt-1 w-32 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
      <p v-if="fieldError('year')" class="mt-1 text-sm text-red-600">{{ fieldError('year') }}</p>
    </div>

    <div>
      <label for="isbn" class="block text-sm font-medium text-slate-700">ISBN</label>
      <input
        id="isbn"
        v-model="isbn"
        type="text"
        class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
      <p v-if="fieldError('isbn')" class="mt-1 text-sm text-red-600">{{ fieldError('isbn') }}</p>
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-slate-700">Описание</label>
      <textarea
        id="description"
        v-model="description"
        rows="4"
        class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      <p v-if="fieldError('description')" class="mt-1 text-sm text-red-600">{{ fieldError('description') }}</p>
    </div>

    <div>
      <label for="authors" class="block text-sm font-medium text-slate-700">Авторы</label>
      <select
        id="authors"
        v-model="selectedAuthorIds"
        multiple
        class="mt-1 h-32 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option v-for="author in authorOptions" :key="author.id" :value="author.id">
          {{ author.full_name }}
        </option>
      </select>
      <p v-if="!authorOptions.length" class="mt-1 text-sm text-slate-500">
        Пока нет ни одного автора — сначала <NuxtLink to="/authors/new" class="text-blue-600 hover:underline">добавьте автора</NuxtLink>.
      </p>
      <p v-if="fieldError('author_ids')" class="mt-1 text-sm text-red-600">{{ fieldError('author_ids') }}</p>
    </div>

    <div>
      <label for="cover" class="block text-sm font-medium text-slate-700">Обложка</label>
      <div class="mt-1 flex items-center gap-4">
        <div class="h-28 w-20 shrink-0 overflow-hidden rounded bg-slate-100">
          <img v-if="coverPreviewUrl" :src="coverPreviewUrl" alt="" class="h-full w-full object-cover">
        </div>
        <input id="cover" type="file" accept="image/*" class="text-sm" @change="onCoverChange">
      </div>
      <p v-if="initialBook" class="mt-1 text-xs text-slate-500">
        Оставьте пустым, чтобы не менять текущую обложку.
      </p>
      <p v-if="fieldError('cover')" class="mt-1 text-sm text-red-600">{{ fieldError('cover') }}</p>
    </div>

    <p v-if="localError" class="text-sm text-red-600">{{ localError }}</p>
    <p v-if="serverError && !serverError.errors.length" class="text-sm text-red-600">
      {{ serverError.message }}
    </p>

    <button
      type="submit"
      :disabled="submitting"
      class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {{ submitting ? 'Сохраняем...' : 'Сохранить' }}
    </button>
  </form>
</template>
