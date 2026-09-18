export default defineEventHandler((event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page ?? 1))
  const perPage = Math.max(1, Number(query['per-page'] ?? 20))
  const search = typeof query.search === 'string' ? query.search.toLowerCase() : undefined

  let items = db.authors
  if (search) items = items.filter(a => a.full_name.toLowerCase().includes(search))

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const pageItems = items.slice((page - 1) * perPage, page * perPage)

  return {
    success: true,
    data: {
      items: pageItems.map(serializeAuthorShort),
      pagination: { total, page, per_page: perPage, total_pages: totalPages }
    }
  }
})
