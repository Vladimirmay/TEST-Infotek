<script setup lang="ts">
import type { Book } from '~/types'

defineProps<{ book: Book }>()
</script>

<template>
  <NuxtLink
    :to="`/books/${book.id}`"
    class="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
  >
    <div class="h-28 w-20 shrink-0 overflow-hidden rounded bg-slate-100">
      <img
        v-if="book.cover_url"
        :src="book.cover_url"
        :alt="book.title"
        class="h-full w-full object-cover"
      >
      <div v-else class="flex h-full w-full items-center justify-center text-xs text-slate-400">
        Нет обложки
      </div>
    </div>

    <div class="min-w-0">
      <h2 class="truncate font-medium text-slate-900">
        {{ book.title }}
      </h2>
      <p class="text-sm text-slate-500">{{ book.year }}</p>
      <p class="mt-1 truncate text-sm text-slate-600">
        {{ book.authors?.map(a => a.full_name).join(', ') || 'Автор не указан' }}
      </p>
    </div>
  </NuxtLink>
</template>
