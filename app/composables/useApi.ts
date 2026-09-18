export function useApi() {
  const { $api } = useNuxtApp()
  return $api as typeof $fetch
}
