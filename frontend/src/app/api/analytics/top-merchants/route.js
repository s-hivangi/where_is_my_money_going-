import { prisma } from '@/lib/prisma'
import { normalizeMerchantName } from '@/lib/merchant'
import { getCurrentUserId } from '@/lib/current-user'

export async function GET() {
  try {
    const userId = await getCurrentUserId()

    const result = await prisma.transactions.findMany({
      where: { type: 'debit', user_id: userId },
      select: {
        merchant: true,
        merchant_normalized: true,
        description: true,
        amount: true,
      }
    })

    const merchantMap = new Map()

    for (const row of result) {
      const merchantSource = row.description || row.merchant_normalized || row.merchant
      const merchant = normalizeMerchantName(merchantSource)
      const current = merchantMap.get(merchant) || { merchant, total: 0, count: 0 }
      current.total += Number(row.amount || 0)
      current.count += 1
      merchantMap.set(merchant, current)
    }

    const data = Array.from(merchantMap.values())
      .sort((left, right) => right.total - left.total)
      .slice(0, 10)

    return Response.json({ success: true, data })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}