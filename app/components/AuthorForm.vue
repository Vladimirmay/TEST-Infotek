<script setup lang="ts">
import type { Author } from '~/types'

const props = defineProps<{
  initialAuthor?: Author | null
  submitting?: boolean
  serverError?: ApiRequestError | null
}>()

const emit = defineEmits<{ submit: [fullName: string] }>()

const fullName = ref(props.initialAuthor?.full_name ?? '')

function onSubmit() {
  emit('submit', fullName.value)
}

function fieldError(field: string) {
  return props.serverError?.fieldError(field)
}
</script>

<template>
  <form class="max-w-md space-y-4" @submit.prevent="onSubmit">
    <div>
      <label for="full_name" class="block text-sm font-medium text-slate-700">ФИО</label>
      <input
        id="full_name"
        v-model="fullName"
        type="text"
        required
        class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
      <p v-if="fieldError('full_name')" class="mt-1 text-sm text-red-600">{{ fieldError('full_name') }}</p>
    </div>

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
