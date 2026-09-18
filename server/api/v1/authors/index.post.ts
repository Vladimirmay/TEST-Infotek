export default defineEventHandler(async (event) => {
  const user = getAuthUser(event)
  if (!user) return unauthorized(event)

  const body = await readBody<{ full_name?: string }>(event)
  if (!body?.full_name) return validationError(event, [{ field: 'full_name', message: 'Укажите ФИО автора' }])

  const author = { id: db.nextAuthorId(), full_name: body.full_name }
  db.authors.push(author)

  setResponseStatus(event, 201)
  return { success: true, data: serializeAuthor(author) }
})
