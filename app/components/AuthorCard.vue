<script setup lang="ts">
import type { AuthorShort } from '~/types'

defineProps<{ author: AuthorShort }>()
</script>

<template>
  <NuxtLink
    :to="`/authors/${author.id}`"
    class="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
  >
    <h2 class="font-medium text-slate-900">{{ author.full_name }}</h2>
  </NuxtLink>
</template>
