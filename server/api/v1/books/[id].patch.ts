interface PatchBookBody {
  title?: string
  year?: number
  description?: string
  isbn?: string
  author_ids?: number[]
}

export default defineEventHandler(async (event) => {
  const user = getAuthUser(event)
  if (!user) return unauthorized(event)

  const id = Number(getRouterParam(event, 'id'))
  const book = db.books.find(b => b.id === id)
  if (!book) return notFound(event, 'Книга не найдена')

  const body = await readBody<PatchBookBody>(event)

  if (body.title !== undefined) book.title = body.title
  if (body.year !== undefined) book.year = body.year
  if (body.description !== undefined) book.description = body.description
  if (body.isbn !== undefined) book.isbn = body.isbn
  if (body.author_ids !== undefined) book.author_ids = body.author_ids

  return { success: true, data: serializeBook(book) }
})
