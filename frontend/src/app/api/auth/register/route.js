import { prisma } from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return Response.json({ success: false, error: 'All fields required' }, { status: 400 })
    }

    if (password.length < 8) {
      return Response.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await prisma.users.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ success: false, error: 'Email already registered' }, { status: 400 })
    }

    const hashed = await hashPassword(password)

    const user = await prisma.users.create({
      data: { name, email, password: hashed }
    })

    const token = signToken({ userId: user.id, email: user.email })

    const response = Response.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email }
    })

    response.headers.set('Set-Cookie', 
      `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`
    )

    return response

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
