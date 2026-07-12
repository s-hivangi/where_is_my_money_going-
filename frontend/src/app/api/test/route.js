import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test 1 — basic connection
    await prisma.$queryRaw`SELECT 1`
    
    // Test 2 — check all tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    // Test 3 — check categories were seeded
    const categories = await prisma.categories.findMany()
    
    // Test 4 — count rows in each table
    const counts = {
      users: await prisma.users.count(),
      households: await prisma.households.count(),
      bank_accounts: await prisma.bank_accounts.count(),
      statements: await prisma.statements.count(),
      transactions: await prisma.transactions.count(),
      categories: await prisma.categories.count(),
      budget_goals: await prisma.budget_goals.count(),
      recurring_transactions: await prisma.recurring_transactions.count(),
      monthly_summaries: await prisma.monthly_summaries.count(),
    }

    return Response.json({
      status: 'connected',
      tables: tables,
      categories: categories,
      rowCounts: counts
    })

  } catch (error) {
    return Response.json({
      status: 'error',
      message: error.message
    }, { status: 500 })
  }
}