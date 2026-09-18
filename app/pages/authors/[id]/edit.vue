<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const authorsApi = useAuthorsApi()
const id = computed(() => Number(route.params.id))

const { data: author, pending, error: loadError } = await useAsyncData(
  () => `author-edit-${id.value}`,
  () => authorsApi.get(id.value)
)

useHead({ title: () => author.value ? `Редактирование: ${author.value.full_name}` : 'Редактирование автора' })

const submitting = ref(false)
const serverError = ref<ApiRequestError | null>(null)

async function onSubmit(fullName: string) {
  submitting.value = true
  serverError.value = null
  try {
    await authorsApi.update(id.value, { full_name: fullName })
    await router.push(`/authors/${id.value}`)
  } catch (error) {
    serverError.value = toApiError(error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <NuxtLink :to="`/authors/${id}`" class="text-sm text-blue-600 hover:underline">
      ← К автору
    </NuxtLink>

    <h1 class="mt-4 text-2xl font-semibold">Редактирование автора</h1>

    <div v-if="pending" class="mt-6 text-sm text-slate-500">
      Загрузка...
    </div>

    <div v-else-if="loadError" class="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Автор не найден.
    </div>

    <AuthorForm
      v-else-if="author"
      class="mt-6"
      :initial-author="author"
      :submitting="submitting"
      :server-error="serverError"
      @submit="onSubmit"
    />
  </div>
</template>
