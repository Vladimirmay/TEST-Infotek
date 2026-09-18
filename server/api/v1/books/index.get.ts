export default defineEventHandler((event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page ?? 1))
  const perPage = Math.max(1, Number(query['per-page'] ?? 20))
  const authorId = query.author_id ? Number(query.author_id) : undefined
  const year = query.year ? Number(query.year) : undefined
  const search = typeof query.search === 'string' ? query.search.toLowerCase() : undefined

  let items = db.books
  if (authorId) items = items.filter(b => b.author_ids.includes(authorId))
  if (year) items = items.filter(b => b.year === year)
  if (search) items = items.filter(b => b.title.toLowerCase().includes(search))

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const pageItems = items.slice((page - 1) * perPage, page * perPage)

  return {
    success: true,
    data: {
      items: pageItems.map(serializeBook),
      pagination: { total, page, per_page: perPage, total_pages: totalPages }
    }
  }
})
