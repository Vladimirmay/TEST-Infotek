export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string; password?: string }>(event)
  const user = db.users.find(u => u.username === body?.username && u.password === body?.password)

  if (!user) {
    setResponseStatus(event, 401)
    return { success: false, errors: [{ message: 'Неверный логин или пароль' }] }
  }

  const token = issueToken(user)

  return {
    success: true,
    data: {
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      user: { id: user.id, username: user.username, role: user.role }
    }
  }
})
