import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/current-user'

export async function GET() {
  try {
    const userId = await getCurrentUserId()

    const summary = await prisma.$queryRaw`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) as total_spending,
        COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) as total_income,
        COUNT(*)::int as total_transactions,
        COUNT(DISTINCT bank_account_id)::int as bank_count,
        MAX(created_at) as last_updated
      FROM transactions
      WHERE user_id = ${userId}
    `

    const topCategory = await prisma.$queryRaw`
      SELECT
        c.name as category,
        COALESCE(SUM(t.amount), 0) as total
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.type = 'debit'
      AND t.user_id = ${userId}
      GROUP BY c.name
      ORDER BY total DESC
      LIMIT 1
    `

    const spending = parseFloat(summary[0]?.total_spending) || 0
    const income = parseFloat(summary[0]?.total_income) || 0
    const transactions = parseInt(summary[0]?.total_transactions || 0)
    const banks = parseInt(summary[0]?.bank_count || 0)
    const saved = Math.max(income - spending, 0)
    const savingsRate = income > 0 ? ((saved / income) * 100) : 0

    return Response.json({
      success: true,
      data: {
        total_spending: spending,
        total_income: income,
        saved,
        savings_rate: parseFloat(savingsRate.toFixed(2)),
        total_transactions: transactions,
        bank_count: banks,
        top_category: topCategory[0]?.category || 'No data',
        top_category_total: parseFloat(topCategory[0]?.total) || 0,
        last_updated: summary[0]?.last_updated || null,
      }
    })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}