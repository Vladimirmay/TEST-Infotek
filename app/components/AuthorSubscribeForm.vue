<script setup lang="ts">
const props = defineProps<{ authorId: number }>()

const subscriptionsApi = useSubscriptionsApi()

const phone = ref('')
const submitting = ref(false)
const success = ref(false)
const errorMessage = ref('')

const phonePattern = /^(\+7|8)\d{10}$/

async function onSubmit() {
  errorMessage.value = ''
  const normalized = phone.value.replace(/[\s()-]/g, '')

  if (!phonePattern.test(normalized)) {
    errorMessage.value = 'Введите номер в формате +7XXXXXXXXXX или 8XXXXXXXXXX'
    return
  }

  submitting.value = true
  try {
    await subscriptionsApi.subscribe(props.authorId, normalized)
    success.value = true
  } catch (error) {
    errorMessage.value = error instanceof ApiRequestError
      ? error.message
      : 'Не удалось оформить подписку. Попробуйте ещё раз.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4">
    <h3 class="text-sm font-medium text-slate-800">Подписаться на новинки автора</h3>
    <p class="mt-1 text-xs text-slate-500">
      Пришлём SMS, когда у автора выйдет новая книга.
    </p>

    <p v-if="success" class="mt-3 text-sm text-green-700">
      Готово, вы подписаны на новинки этого автора.
    </p>

    <form v-else class="mt-3 flex flex-wrap items-start gap-2" @submit.prevent="onSubmit">
      <div>
        <input
          v-model="phone"
          type="tel"
          placeholder="+7 900 000-00-00"
          class="w-52 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        >
        <p v-if="errorMessage" class="mt-1 text-xs text-red-600">{{ errorMessage }}</p>
      </div>
      <button
        type="submit"
        :disabled="submitting"
        class="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {{ submitting ? 'Отправляем...' : 'Подписаться' }}
      </button>
    </form>
  </div>
</template>
