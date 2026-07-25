import { prisma } from '@/lib/prisma'
import { verifyPassword, signToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ success: false, error: 'All fields required' }, { status: 400 })
    }

    const user = await prisma.users.findUnique({ where: { email } })
    if (!user) {
      return Response.json({ success: false, error: 'Invalid email or password' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return Response.json({ success: false, error: 'Invalid email or password' }, { status: 401 })
    }

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
