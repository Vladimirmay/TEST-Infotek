export default defineEventHandler(async (event) => {
  const user = getAuthUser(event)
  if (!user) return unauthorized(event)

  const id = Number(getRouterParam(event, 'id'))
  const book = db.books.find(b => b.id === id)
  if (!book) return notFound(event, 'Книга не найдена')

  const parts = await readMultipartFormData(event)
  const fields = parseBookForm(parts ?? [])
  const errors = validateBookForm(fields, { requireCover: true })
  if (errors.length) return validationError(event, errors)

  book.title = fields.title!
  book.year = fields.year!
  book.description = fields.description
  book.isbn = fields.isbn
  book.author_ids = fields.author_ids
  book.cover_url = fields.coverDataUrl

  return { success: true, data: serializeBook(book) }
})
