import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const type = searchParams.get('type') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20

    const result = await prisma.$queryRaw`
      SELECT 
        t.id,
        t.date,
        t.merchant,
        t.amount,
        t.type,
        c.name as category,
        c.color,
        ba.bank_name
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      LEFT JOIN bank_accounts ba ON t.bank_account_id = ba.id
      WHERE 
        (${search} = '' OR LOWER(t.merchant) LIKE LOWER(${'%' + search + '%'}))
        AND (${category} = '' OR c.name = ${category})
        AND (${type} = '' OR t.type = ${type})
      ORDER BY t.date DESC
      LIMIT ${limit}
      OFFSET ${(page - 1) * limit}
    `

    const data = result.map(row => ({
      id: parseInt(row.id),
      date: row.date,
      merchant: row.merchant,
      amount: parseFloat(row.amount),
      type: row.type,
      category: row.category,
      color: row.color,
      bank_name: row.bank_name
    }))

    return Response.json({ success: true, data })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}