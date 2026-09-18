export function useSubscriptionsApi() {
  const api = useApi()

  async function subscribe(authorId: number, phone: string): Promise<void> {
    try {
      await api(`/authors/${authorId}/subscribe`, {
        method: 'POST',
        body: { phone }
      })
    } catch (error) {
      throw toApiError(error)
    }
  }

  return { subscribe }
}
