import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function getCurrentUserId() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    throw new Error('Not authenticated')
  }

  const payload = verifyToken(token)
  if (!payload?.userId) {
    throw new Error('Invalid token')
  }

  return payload.userId
}