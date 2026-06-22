import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken, generateToken, generateRefreshToken, hashPassword, comparePassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, email, password, name, role } = body

    if (action === 'login') {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

      const valid = await comparePassword(password, user.password)
      if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

      const token = generateToken({ userId: user.id, email: user.email, role: user.role })
      const refreshToken = generateRefreshToken({ userId: user.id })

      await prisma.refreshToken.create({
        data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      })

      return NextResponse.json({
        token, refreshToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      })
    }

    if (action === 'register') {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 })

      const hashedPassword = await hashPassword(password)
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name, role: role || 'DEVELOPER' },
      })
      return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } }, { status: 201 })
    }

    if (action === 'refresh') {
      const { refreshToken } = body
      const payload = verifyToken(refreshToken)
      if (!payload) return NextResponse.json({ error: 'Invalid' }, { status: 401 })

      const user = await prisma.user.findUnique({ where: { id: payload.userId } })
      if (!user) return NextResponse.json({ error: 'Not found' }, { status: 401 })

      const newToken = generateToken({ userId: user.id, email: user.email, role: user.role })
      return NextResponse.json({ token: newToken })
    }

    if (action === 'logout') {
      const { refreshToken } = body
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
      return NextResponse.json({ message: 'Logged out' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (e) {
    console.error('Auth error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
