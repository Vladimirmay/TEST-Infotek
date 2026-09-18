// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint'
  ],

  css: ['~/assets/css/tailwind.css'],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css'
  },

  runtimeConfig: {
    smspilotApiKey: process.env.SMSPILOT_API_KEY || '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api/v1'
    }
  },

  typescript: {
    strict: true,
    typeCheck: false
  }
})
