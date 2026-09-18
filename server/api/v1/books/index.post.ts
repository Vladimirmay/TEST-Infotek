export default defineEventHandler(async (event) => {
  const user = getAuthUser(event)
  if (!user) return unauthorized(event)

  const parts = await readMultipartFormData(event)
  const fields = parseBookForm(parts ?? [])
  const errors = validateBookForm(fields, { requireCover: true })
  if (errors.length) return validationError(event, errors)

  const book = {
    id: db.nextBookId(),
    title: fields.title!,
    year: fields.year!,
    description: fields.description,
    isbn: fields.isbn,
    author_ids: fields.author_ids,
    cover_url: fields.coverDataUrl
  }
  db.books.push(book)

  await notifySubscribers(book)

  setResponseStatus(event, 201)
  return { success: true, data: serializeBook(book) }
})
