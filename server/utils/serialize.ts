import type { Author, AuthorShort, Book } from '../../app/types'
import { db, type DbAuthor, type DbBook } from './db'

export function serializeBook(book: DbBook): Book {
  return {
    id: book.id,
    title: book.title,
    year: book.year,
    description: book.description,
    isbn: book.isbn,
    cover_url: book.cover_url,
    authors: book.author_ids.map((id): AuthorShort => {
      const author = db.authors.find(a => a.id === id)
      return { id, full_name: author?.full_name ?? 'Неизвестный автор' }
    })
  }
}

export function serializeAuthorShort(author: DbAuthor): AuthorShort {
  return { id: author.id, full_name: author.full_name }
}

export function serializeAuthor(author: DbAuthor): Author {
  return {
    id: author.id,
    full_name: author.full_name,
    books: db.books
      .filter(b => b.author_ids.includes(author.id))
      .map(b => ({ id: b.id, title: b.title, year: b.year }))
  }
}
