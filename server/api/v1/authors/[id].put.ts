export default defineEventHandler(async (event) => {
  const user = getAuthUser(event)
  if (!user) return unauthorized(event)

  const id = Number(getRouterParam(event, 'id'))
  const author = db.authors.find(a => a.id === id)
  if (!author) return notFound(event, 'Автор не найден')

  const body = await readBody<{ full_name?: string }>(event)
  if (!body?.full_name) return validationError(event, [{ field: 'full_name', message: 'Укажите ФИО автора' }])

  author.full_name = body.full_name

  return { success: true, data: serializeAuthor(author) }
})
