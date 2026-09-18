import type { H3Event } from 'h3'
import type { ApiErrorItem } from '../../app/types'

export function unauthorized(event: H3Event) {
  setResponseStatus(event, 401)
  return { success: false, errors: [{ message: 'Требуется авторизация' }] }
}

export function notFound(event: H3Event, message: string) {
  setResponseStatus(event, 404)
  return { success: false, errors: [{ message }] }
}

export function validationError(event: H3Event, errors: ApiErrorItem[]) {
  setResponseStatus(event, 422)
  return { success: false, errors }
}
