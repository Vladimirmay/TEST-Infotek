export default defineEventHandler((event) => {
  const query = getQuery(event)
  const year = query.year ? Number(query.year) : undefined

  if (!year) {
    setResponseStatus(event, 400)
    return { success: false, errors: [{ field: 'year', message: 'Параметр year обязателен' }] }
  }

  const counts = new Map<number, number>()
  for (const book of db.books) {
    if (book.year !== year) continue
    for (const authorId of book.author_ids) {
      counts.set(authorId, (counts.get(authorId) ?? 0) + 1)
    }
  }

  const items = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([authorId, count], index) => ({
      rank: index + 1,
      author_id: authorId,
      full_name: db.authors.find(a => a.id === authorId)?.full_name ?? 'Неизвестный автор',
      books_count: count
    }))

  return { success: true, data: { year, items } }
})
