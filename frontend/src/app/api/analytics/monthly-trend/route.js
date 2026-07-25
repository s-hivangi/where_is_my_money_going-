import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(date, 'YYYY-MM') as month,
        SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as spending
      FROM transactions
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month ASC
    `

    const data = result.map(row => ({
      month: row.month,
      income: parseFloat(row.income),
      spending: parseFloat(row.spending)
    }))

    return Response.json({ success: true, data })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
