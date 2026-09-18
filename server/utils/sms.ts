import { db, type DbBook } from './db'

async function sendSms(phone: string, text: string): Promise<void> {
  const config = useRuntimeConfig()
  const apiKey = config.smspilotApiKey

  if (!apiKey) {
    console.warn('[sms] SMSPILOT_API_KEY не задан в .env — SMS не отправлено', { phone, text })
    return
  }

  try {
    const result = await $fetch('https://smspilot.ru/api.php', {
      method: 'GET',
      query: { send: text, to: phone, apikey: apiKey, format: 'json' }
    })
    console.info('[sms] Отправлено через smspilot.ru', { phone, result })
  } catch (error) {
    console.error('[sms] Ошибка отправки через smspilot.ru', { phone, error })
  }
}

export async function notifySubscribers(book: DbBook): Promise<void> {
  const authorNames = book.author_ids
    .map(id => db.authors.find(a => a.id === id)?.full_name)
    .filter((name): name is string => Boolean(name))

  const phones = new Set(
    db.subscriptions
      .filter(s => book.author_ids.includes(s.author_id))
      .map(s => s.phone)
  )

  if (!phones.size) return

  const text = `Новая книга «${book.title}» (${authorNames.join(', ')}) уже в каталоге!`
  await Promise.all([...phones].map(phone => sendSms(phone, text)))
}
