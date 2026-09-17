<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="text-lg font-semibold">
          Каталог книг
        </NuxtLink>

        <nav class="flex items-center gap-4 text-sm">
          <NuxtLink to="/" class="hover:text-blue-600">Книги</NuxtLink>
          <NuxtLink to="/authors" class="hover:text-blue-600">Авторы</NuxtLink>
          <NuxtLink to="/reports/top-authors" class="hover:text-blue-600">Топ авторов</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>
