import type { components } from '~/types/api'
import type { Book, BookFormData, BookInput, BooksQuery, Paginated } from '~/types'

type BookListResponse = components['schemas']['BookListResponse']
type BookResponse = components['schemas']['BookResponse']

function buildBookFormData(data: BookFormData): FormData {
  const form = new FormData()
  form.append('title', data.title)
  form.append('year', String(data.year))
  if (data.description) form.append('description', data.description)
  if (data.isbn) form.append('isbn', data.isbn)
  data.author_ids.forEach(id => form.append('author_ids[]', String(id)))
  if (data.cover) form.append('cover', data.cover)
  return form
}

export function useBooksApi() {
  const api = useApi()

  async function list(query: BooksQuery = {}): Promise<Paginated<Book>> {
    try {
      const res = await api<BookListResponse>('/books', {
        query: {
          page: query.page,
          'per-page': query.perPage,
          author_id: query.authorId,
          year: query.year,
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

  async function get(id: number): Promise<Book> {
    try {
      const res = await api<BookResponse>(`/books/${id}`)
      return res.data as Book
    } catch (error) {
      throw toApiError(error)
    }
  }

  async function create(data: BookFormData): Promise<Book> {
    try {
      const res = await api<BookResponse>('/books', {
        method: 'POST',
        body: buildBookFormData(data)
      })
      return res.data as Book
    } catch (error) {
      throw toApiError(error)
    }
  }

  async function update(id: number, data: BookFormData): Promise<Book> {
    try {
      const res = await api<BookResponse>(`/books/${id}`, {
        method: 'PUT',
        body: buildBookFormData(data)
      })
      return res.data as Book
    } catch (error) {
      throw toApiError(error)
    }
  }

  async function patch(id: number, data: BookInput): Promise<Book> {
    try {
      const res = await api<BookResponse>(`/books/${id}`, {
        method: 'PATCH',
        body: data
      })
      return res.data as Book
    } catch (error) {
      throw toApiError(error)
    }
  }

  async function remove(id: number): Promise<void> {
    try {
      await api(`/books/${id}`, { method: 'DELETE' })
    } catch (error) {
      throw toApiError(error)
    }
  }

  return { list, get, create, update, patch, remove }
}
