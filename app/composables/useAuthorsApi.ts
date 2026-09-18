import type { components } from '~/types/api'
import type { Author, AuthorInput, AuthorShort, AuthorsQuery, Paginated } from '~/types'

type AuthorListResponse = components['schemas']['AuthorListResponse']
type AuthorResponse = components['schemas']['AuthorResponse']

export function useAuthorsApi() {
  const api = useApi()

  async function list(query: AuthorsQuery = {}): Promise<Paginated<AuthorShort>> {
    try {
      const res = await api<AuthorListResponse>('/authors', {
        query: {
          page: query.page,
          'per-page': query.perPage,
          search: query.search
        }
      })
      return {
        items: res.data?.items ?? [],
        pagination: res.data?.pagination ?? { total: 0, page: 1, per_page: 20, total_pages: 0 }
      }
    } catch (error) {
      throw toApiError(error)
    }
  }

  async function get(id: number): Promise<Author> {
    try {
      const res = await api<AuthorResponse>(`/authors/${id}`)
      return res.data as Author
    } catch (error) {
      throw toApiError(error)
    }
  }

  async function create(data: AuthorInput): Promise<Author> {
    try {
      const res = await api<AuthorResponse>('/authors', {
        method: 'POST',
        body: data
      })
      return res.data as Author
    } catch (error) {
      throw toApiError(error)
    }
  }

  async function update(id: number, data: AuthorInput): Promise<Author> {
    try {
      const res = await api<AuthorResponse>(`/authors/${id}`, {
        method: 'PUT',
        body: data
      })
      return res.data as Author
    } catch (error) {
      throw toApiError(error)
    }
  }

  async function remove(id: number): Promise<void> {
    try {
      await api(`/authors/${id}`, { method: 'DELETE' })
    } catch (error) {
      throw toApiError(error)
    }
  }

  return { list, get, create, update, remove }
}
