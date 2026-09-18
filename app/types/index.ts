import type { components } from './api'

export type Book = components['schemas']['Book']
export type AuthorShort = components['schemas']['AuthorShort']
export type Author = components['schemas']['Author']
export type BookShort = components['schemas']['BookShort']
export type BookInput = components['schemas']['BookInput']
export type AuthorInput = components['schemas']['AuthorInput']
export type Pagination = components['schemas']['Pagination']
export type TopAuthor = components['schemas']['TopAuthor']
export type ApiErrorBody = components['schemas']['Error']
export type ApiErrorItem = components['schemas']['ErrorItem']
export type LoginRequest = components['schemas']['LoginRequest']
export type LoginResponse = components['schemas']['LoginResponse']
export type AuthUser = NonNullable<NonNullable<LoginResponse['data']>['user']>

export interface Paginated<T> {
  items: T[]
  pagination: Pagination
}

export interface BooksQuery {
  page?: number
  perPage?: number
  authorId?: number
  year?: number
  search?: string
}

export interface AuthorsQuery {
  page?: number
  perPage?: number
  search?: string
}

export interface BookFormData {
  title: string
  year: number
  description?: string
  isbn?: string
  author_ids: number[]
  cover?: File | null
}
