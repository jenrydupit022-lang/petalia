"use client";

import { getSales, getExpenses } from "@/lib/storage";

export default function AnalyticsPage() {
  const sales = getSales();
  const expenses = getExpenses();

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.cost, 0);
  const profit = totalSales - totalExpenses;

  const totalOrders = sales.length;

  const bouquetCount: Record<string, number> = {};
  const colorCount: Record<string, number> = {};

  sales.forEach((sale) => {
    bouquetCount[sale.bouquet] =
      (bouquetCount[sale.bouquet] || 0) + sale.quantity;

    colorCount[sale.color] =
      (colorCount[sale.color] || 0) + sale.quantity;
  });

  const bestBouquet =
    Object.entries(bouquetCount).sort((a, b) => b[1] - a[1])[0];

  const bestColor =
    Object.entries(colorCount).sort((a, b) => b[1] - a[1])[0];

  const profitMargin =
    totalSales > 0 ? ((profit / totalSales) * 100).toFixed(1) : "0";

  return (
    <main className="min-h-screen bg-pink-50 p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-pink-600 mb-10">
          📊 Business Analytics
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Card title="💰 Total Sales" value={`₱${totalSales.toLocaleString()}`} />
          <Card title="💸 Total Expenses" value={`₱${totalExpenses.toLocaleString()}`} />
          <Card title="📈 Net Profit" value={`₱${profit.toLocaleString()}`} />
          <Card title="🛍 Orders" value={totalOrders.toString()} />
          <Card title="🏆 Best Seller" value={bestBouquet?.[0] ?? "-"} />
          <Card title="🎨 Best Color" value={bestColor?.[0] ?? "-"} />
          <Card title="📊 Profit Margin" value={`${profitMargin}%`} />

        </div>
      </div>
    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-gray-500">{title}</h2>

      <p className="text-3xl font-bold text-pink-600 mt-3">
        {value}
      </p>
    </div>
  );
}