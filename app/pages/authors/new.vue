<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Новый автор' })

const router = useRouter()
const authorsApi = useAuthorsApi()

const submitting = ref(false)
const serverError = ref<ApiRequestError | null>(null)

async function onSubmit(fullName: string) {
  submitting.value = true
  serverError.value = null
  try {
    const author = await authorsApi.create({ full_name: fullName })
    await router.push(`/authors/${author.id}`)
  } catch (error) {
    serverError.value = toApiError(error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <NuxtLink to="/authors" class="text-sm text-blue-600 hover:underline">
      ← К списку авторов
    </NuxtLink>

    <h1 class="mt-4 text-2xl font-semibold">Новый автор</h1>

    <AuthorForm
      class="mt-6"
      :submitting="submitting"
      :server-error="serverError"
      @submit="onSubmit"
    />
  </div>
</template>
