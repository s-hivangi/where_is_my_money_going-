import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        merchant_normalized as merchant,
        SUM(amount) as total,
        COUNT(id) as count
      FROM transactions
      WHERE type = 'debit'
      GROUP BY merchant_normalized
      ORDER BY total DESC
      LIMIT 10
    `

    const data = result.map(row => ({
      merchant: row.merchant,
      total: parseFloat(row.total),
      count: parseInt(row.count)
    }))

    return Response.json({ success: true, data })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}