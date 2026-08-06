import { prisma } from '@/lib/prisma'
import { normalizeMerchantName } from '@/lib/merchant'
import { getCurrentUserId } from '@/lib/current-user'

export async function GET() {
  try {
    const userId = await getCurrentUserId()

    const result = await prisma.$queryRaw`
      SELECT 
        t.date,
        t.merchant,
        t.description,
        t.amount,
        t.type,
        c.name as category,
        c.color,
        avg_data.avg_amount
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      JOIN (
        SELECT 
          category_id,
          AVG(amount) as avg_amount,
          STDDEV(amount) as std_amount
        FROM transactions
        WHERE type = 'debit'
        AND user_id = ${userId}
        GROUP BY category_id
      ) avg_data ON t.category_id = avg_data.category_id
      WHERE t.type = 'debit'
      AND t.user_id = ${userId}
      AND t.amount > (avg_data.avg_amount + (2 * avg_data.std_amount))
      ORDER BY t.amount DESC
      LIMIT 5
    `

    const data = result.map(row => ({
      date: row.date,
      merchant: normalizeMerchantName(row.description || row.merchant),
      amount: parseFloat(row.amount),
      type: row.type,
      category: row.category,
      color: row.color,
      avg_amount: parseFloat(row.avg_amount)
    }))

    return Response.json({ success: true, data })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}