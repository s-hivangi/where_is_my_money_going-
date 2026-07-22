import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        c.name as category,
        c.color,
        SUM(t.amount) as total,
        COUNT(t.id) as count
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.type = 'debit'
      GROUP BY c.name, c.color
      ORDER BY total DESC
    `

    const data = result.map(row => ({
      category: row.category,
      color: row.color,
      total: parseFloat(row.total),
      count: parseInt(row.count)
    }))

    return Response.json({ success: true, data })

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}