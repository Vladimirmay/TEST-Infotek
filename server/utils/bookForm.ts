import type { MultiPartData } from 'h3'
import type { ApiErrorItem } from '../../app/types'

export interface ParsedBookForm {
  title?: string
  year?: number
  description?: string
  isbn?: string
  author_ids: number[]
  coverDataUrl?: string
}

export function parseBookForm(parts: MultiPartData[]): ParsedBookForm {
  const result: ParsedBookForm = { author_ids: [] }

  for (const part of parts) {
    const text = () => part.data.toString('utf-8')

    if (part.name === 'title') result.title = text()
    else if (part.name === 'year') result.year = Number(text())
    else if (part.name === 'description') result.description = text()
    else if (part.name === 'isbn') result.isbn = text()
    else if (part.name === 'author_ids[]') result.author_ids.push(Number(text()))
    else if (part.name === 'cover' && part.filename) {
      const mime = part.type || 'application/octet-stream'
      result.coverDataUrl = `data:${mime};base64,${part.data.toString('base64')}`
    }
  }

  return result
}

export function validateBookForm(fields: ParsedBookForm, opts: { requireCover: boolean }): ApiErrorItem[] {
  const errors: ApiErrorItem[] = []

  if (!fields.title) errors.push({ field: 'title', message: 'Укажите название' })
  if (!fields.year) errors.push({ field: 'year', message: 'Укажите год выпуска' })
  if (!fields.author_ids.length) errors.push({ field: 'author_ids', message: 'Выберите хотя бы одного автора' })
  if (opts.requireCover && !fields.coverDataUrl) errors.push({ field: 'cover', message: 'Загрузите обложку' })

  return errors
}
