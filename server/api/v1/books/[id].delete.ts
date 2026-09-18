export default defineEventHandler((event) => {
  const user = getAuthUser(event)
  if (!user) return unauthorized(event)

  const id = Number(getRouterParam(event, 'id'))
  const index = db.books.findIndex(b => b.id === id)
  if (index === -1) return notFound(event, 'Книга не найдена')

  db.books.splice(index, 1)
  setResponseStatus(event, 204)
  return null
})
