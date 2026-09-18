export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const author = db.authors.find(a => a.id === id)
  if (!author) return notFound(event, 'Автор не найден')

  return { success: true, data: serializeAuthor(author) }
})
