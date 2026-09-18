import type { ApiErrorItem } from '~/types'

export class ApiRequestError extends Error {
  status: number
  errors: ApiErrorItem[]

  constructor(status: number, errors: ApiErrorItem[], message?: string) {
    super(message || errors[0]?.message || 'Ошибка запроса')
    this.name = 'ApiRequestError'
    this.status = status
    this.errors = errors
  }

  fieldError(field: string): string | undefined {
    return this.errors.find(item => item.field === field)?.message
  }
}

export function toApiError(error: unknown): ApiRequestError {
  const fetchError = error as { data?: { errors?: ApiErrorItem[] }; status?: number; message?: string }
  return new ApiRequestError(
    fetchError.status ?? 0,
    fetchError.data?.errors ?? [],
    fetchError.status ? undefined : fetchError.message
  )
}
