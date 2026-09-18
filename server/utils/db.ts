export interface DbAuthor {
  id: number
  full_name: string
}

export interface DbBook {
  id: number
  title: string
  year: number
  description?: string
  isbn?: string
  cover_url?: string
  author_ids: number[]
}

export interface DbSubscription {
  author_id: number
  phone: string
}

export interface DbUser {
  id: number
  username: string
  password: string
  role: string
}

const authors: DbAuthor[] = [
  { id: 1, full_name: 'Лев Толстой' },
  { id: 2, full_name: 'Фёдор Достоевский' },
  { id: 3, full_name: 'Александр Пушкин' }
]

const books: DbBook[] = [
  { id: 1, title: 'Война и мир', year: 1869, description: 'Роман-эпопея о жизни русского общества в эпоху войн против Наполеона.', isbn: '978-5-17-090564-6', author_ids: [1] },
  { id: 2, title: 'Анна Каренина', year: 1877, description: 'Роман о трагической любви замужней женщины.', isbn: '978-5-389-06256-2', author_ids: [1] },
  { id: 3, title: 'Преступление и наказание', year: 1866, description: 'Роман о нравственных терзаниях бывшего студента.', isbn: '978-5-17-080837-4', author_ids: [2] },
  { id: 4, title: 'Евгений Онегин', year: 1833, description: 'Роман в стихах.', isbn: '978-5-389-00069-4', author_ids: [3] }
]

const subscriptions: DbSubscription[] = []

const users: DbUser[] = [
  { id: 1, username: 'user', password: 'password', role: 'user' }
]

let bookIdCounter = books.length
let authorIdCounter = authors.length

export const db = {
  authors,
  books,
  subscriptions,
  users,
  nextBookId: () => ++bookIdCounter,
  nextAuthorId: () => ++authorIdCounter
}
