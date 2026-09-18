export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const book = db.books.find(b => b.id === id)
  if (!book) return notFound(event, 'Книга не найдена')

  return { success: true, data: serializeBook(book) }
})
