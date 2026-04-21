import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Total Revenue (from transactions - so deletions are reflected)
    const transactionsForRevenue = await prisma.transaction.findMany({
      select: { Qty: true, SellingPrice: true }
    });
    const totalRevenue = transactionsForRevenue.reduce((sum, t) => {
      return sum + (t.Qty * Number(t.SellingPrice));
    }, 0);

    // 2. Total Transactions (Lifetime)
    const transactionsCount = await prisma.billing.count();

    // 3. Low Stock Count
    const allProducts = await prisma.product.findMany({
      select: { Quantity: true, ReorderPoint: true }
    });
    const realLowStockCount = allProducts.filter(p => p.Quantity <= p.ReorderPoint).length;

    // 4. Inventory Value (At Cost)
    const productsForValue = await prisma.product.findMany({
      select: { Quantity: true, CostPrice: true }
    });
    const inventoryValue = productsForValue.reduce((sum, p) => sum + (p.Quantity * Number(p.CostPrice)), 0);

    // 5. Gross Profit (Lifetime - from transactions)
    const transactionsForProfit = await prisma.transaction.findMany({
      select: { Qty: true, SellingPrice: true, CostPrice: true }
    });
    const totalProfit = transactionsForProfit.reduce((sum, t) => {
      return sum + (t.Qty * (Number(t.SellingPrice) - Number(t.CostPrice)));
    }, 0);

    return NextResponse.json({
      revenue: totalRevenue,
      transactions: transactionsCount,
      lowStock: realLowStockCount,
      inventoryValue: inventoryValue,
      profit: totalProfit
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
