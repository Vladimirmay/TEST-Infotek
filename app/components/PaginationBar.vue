<script setup lang="ts">
import type { Pagination } from '~/types'

const props = defineProps<{ pagination: Pagination }>()
const emit = defineEmits<{ change: [page: number] }>()

const page = computed(() => props.pagination.page ?? 1)
const totalPages = computed(() => props.pagination.total_pages ?? 1)
</script>

<template>
  <div v-if="totalPages > 1" class="mt-6 flex items-center justify-center gap-4 text-sm">
    <button
      type="button"
      class="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-40"
      :disabled="page <= 1"
      @click="emit('change', page - 1)"
    >
      Назад
    </button>

    <span class="text-slate-600">Страница {{ page }} из {{ totalPages }}</span>

    <button
      type="button"
      class="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-40"
      :disabled="page >= totalPages"
      @click="emit('change', page + 1)"
    >
      Вперёд
    </button>
  </div>
</template>
