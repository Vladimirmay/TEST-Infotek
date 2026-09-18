export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const author = db.authors.find(a => a.id === id)
  if (!author) return notFound(event, 'Автор не найден')

  const body = await readBody<{ phone?: string }>(event)
  const phone = body?.phone?.trim()
  if (!phone || !/^(\+7|8)\d{10}$/.test(phone)) {
    return validationError(event, [{ field: 'phone', message: 'Некорректный номер телефона' }])
  }

  db.subscriptions.push({ author_id: id, phone })

  return { success: true }
})
