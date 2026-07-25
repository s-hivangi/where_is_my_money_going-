import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as total_spending
      FROM transactions
    `

    const income = parseFloat(result[0].total_income) || 0
    const spending = parseFloat(result[0].total_spending) || 0
    const savings_rate = income > 0 ? ((income - spending) / income * 100) : 0

    return Response.json({
      success: true,
      data: {
        total_income: income,
        total_spending: spending,
        savings_rate: parseFloat(savings_rate.toFixed(2))
      }
    })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}