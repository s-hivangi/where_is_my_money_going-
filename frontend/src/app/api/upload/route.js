import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    // get logged in user from token
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    if (!token) {
      return Response.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return Response.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }

    const userId = payload.userId

    // parse the form data
    const formData = await request.formData()
    const file = formData.get('file')
    const bankName = formData.get('bankName')

    if (!file) {
      return Response.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // validate file type
    if (!file.name.endsWith('.pdf')) {
      return Response.json({ success: false, error: 'Only PDF files are accepted' }, { status: 400 })
    }

    // validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ success: false, error: 'File too large. Max 10MB' }, { status: 400 })
    }

    // create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // save file with unique name
    const timestamp = Date.now()
    const fileName = `${userId}_${timestamp}_${file.name.replace(/\s/g, '_')}`
    const filePath = path.join(uploadsDir, fileName)
    const fileUrl = `/uploads/${fileName}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // create or find bank account
    let bankAccount = await prisma.bank_accounts.findFirst({
      where: { user_id: userId, bank_name: bankName }
    })

    if (!bankAccount) {
      bankAccount = await prisma.bank_accounts.create({
        data: { user_id: userId, bank_name: bankName, account_type: 'checking' }
      })
    }

    // create statement record
    const statement = await prisma.statements.create({
      data: {
        user_id: userId,
        bank_account_id: bankAccount.id,
        bank_name: bankName,
        storage_url: fileUrl,
        status: 'PENDING'
      }
    })

    return Response.json({
      success: true,
      message: 'File uploaded successfully',
      statementId: statement.id,
      fileUrl
    })

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
