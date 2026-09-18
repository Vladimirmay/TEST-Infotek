import type { components } from '~/types/api'
import type { TopAuthor } from '~/types'

type TopAuthorsResponse = components['schemas']['TopAuthorsResponse']

export function useReportsApi() {
  const api = useApi()

  async function topAuthors(year: number): Promise<TopAuthor[]> {
    try {
      const res = await api<TopAuthorsResponse>('/reports/top-authors', {
        query: { year }
      })
      return res.data?.items ?? []
    } catch (error) {
      throw toApiError(error)
    }
  }

  return { topAuthors }
}
