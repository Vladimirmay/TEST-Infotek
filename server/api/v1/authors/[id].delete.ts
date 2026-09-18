export default defineEventHandler((event) => {
  const user = getAuthUser(event)
  if (!user) return unauthorized(event)

  const id = Number(getRouterParam(event, 'id'))
  const index = db.authors.findIndex(a => a.id === id)
  if (index === -1) return notFound(event, 'Автор не найден')

  db.authors.splice(index, 1)
  setResponseStatus(event, 204)
  return null
})
