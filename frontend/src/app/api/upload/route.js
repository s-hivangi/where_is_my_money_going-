import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

const PYTHON_API_URL = process.env.PYTHON_API_URL || process.env.BACKEND_URL || 'http://127.0.0.1:8000'

function normalizeType(transaction) {
  const type = String(transaction.type || '').toUpperCase()
  if (type === 'CREDIT' || Number(transaction.amount) > 0) return 'credit'
  return 'debit'
}

function normalizeAmount(transaction) {
  return Math.abs(Number(transaction.amount || 0))
}

function getTransactionDate(transaction) {
  const date = new Date(transaction.date)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid transaction date: ${transaction.date}`)
  }
  return date
}

function buildTransactionHash(userId, transaction) {
  const hashInput = [
    userId,
    transaction.date,
    transaction.description || '',
    transaction.merchant || '',
    transaction.amount,
    transaction.type || ''
  ].join('|')

  return crypto.createHash('sha256').update(hashInput).digest('hex')
}

async function getCategoryId(categoryName) {
  const name = categoryName || 'Other'

  const category = await prisma.categories.upsert({
    where: { name },
    update: {},
    create: { name }
  })

  return category.id
}

async function processWithPython(file, bankName, pdfPassword) {
  const pythonFormData = new FormData()
  pythonFormData.append('file', file, file.name)
  pythonFormData.append('bankName', bankName)
  if (pdfPassword) {
    pythonFormData.append('pdfPassword', pdfPassword)
  }

  const response = await fetch(`${PYTHON_API_URL.replace(/\/$/, '')}/api/upload/`, {
    method: 'POST',
    body: pythonFormData
  })

  const data = await response.json().catch(() => null)

  if (!response.ok || !data) {
    throw new Error(data?.detail || data?.error || 'Python upload service failed')
  }

  return data.transactions || []
}

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) {
      return Response.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return Response.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }

    const userId = payload.userId
    const formData = await request.formData()
    const file = formData.get('file')
    const bankName = formData.get('bankName')
    const pdfPassword = formData.get('pdfPassword')

    if (!file) {
      return Response.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    if (!bankName) {
      return Response.json({ success: false, error: 'Bank name is required' }, { status: 400 })
    }

    if (!file.name.endsWith('.pdf')) {
      return Response.json({ success: false, error: 'Only PDF files are accepted' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ success: false, error: 'File too large. Max 10MB' }, { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const timestamp = Date.now()
    const fileName = `${userId}_${timestamp}_${file.name.replace(/\s/g, '_')}`
    const filePath = path.join(uploadsDir, fileName)
    const fileUrl = `/uploads/${fileName}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    const transactions = await processWithPython(file, bankName, pdfPassword)

    let bankAccount = await prisma.bank_accounts.findFirst({
      where: { user_id: userId, bank_name: bankName }
    })

    if (!bankAccount) {
      bankAccount = await prisma.bank_accounts.create({
        data: { user_id: userId, bank_name: bankName, account_type: 'checking' }
      })
    }

    const statement = await prisma.statements.create({
      data: {
        user_id: userId,
        bank_account_id: bankAccount.id,
        bank_name: bankName,
        storage_url: fileUrl,
        status: 'PENDING'
      }
    })

    let inserted = 0
    let skipped = 0

    for (const transaction of transactions) {
      const hash = buildTransactionHash(userId, transaction)
      const exists = await prisma.transactions.findUnique({ where: { hash } })

      if (exists) {
        skipped += 1
        continue
      }

      const description = transaction.description || transaction.merchant || 'Transaction'
      const merchant = transaction.merchant || description
      const categoryId = await getCategoryId(transaction.category)

      await prisma.transactions.create({
        data: {
          user_id: userId,
          statement_id: statement.id,
          bank_account_id: bankAccount.id,
          date: getTransactionDate(transaction),
          description,
          merchant,
          merchant_normalized: merchant.toLowerCase().trim(),
          amount: normalizeAmount(transaction),
          type: normalizeType(transaction),
          category_id: categoryId,
          confidence: transaction.confidence ?? null,
          hash,
          needs_review: false,
          is_duplicate: false
        }
      })

      inserted += 1
    }

    await prisma.statements.update({
      where: { id: statement.id },
      data: {
        status: 'COMPLETED',
        total_transactions: inserted + skipped
      }
    })

    return Response.json({
      success: true,
      message: 'Statement processed successfully',
      statementId: statement.id,
      fileUrl,
      inserted,
      skipped,
      transactions
    })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
