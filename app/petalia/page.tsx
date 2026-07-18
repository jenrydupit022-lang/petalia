"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSales, Sale } from "@/lib/storage";
import Sidebar from "@/components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
type Expense = {
  id: number;
  date: string;
  category: string;
  item: string;
  cost: number;
};

export default function PetaliaPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
const [businessName, setBusinessName] = useState("The Studio Petalia");
const [websiteTitle, setWebsiteTitle] = useState("Flower Shop Management Dashboard");
 useEffect(() => {
  setSales(getSales());

  const storedExpenses = JSON.parse(
    localStorage.getItem("expenses") || "[]"
  );

  setExpenses(storedExpenses);

  setBusinessName(
    localStorage.getItem("businessName") || "The Studio Petalia"
  );

  setWebsiteTitle(
    localStorage.getItem("websiteTitle") || "Flower Shop Management Dashboard"
  );

}, []);

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.cost,
    0
  );

  const totalBouquets = sales.reduce(
    (sum, sale) => sum + sale.quantity,
    0
  );

  const profit = totalSales - totalExpenses;
const bouquetCount: Record<string, number> = {};

sales.forEach((sale) => {
  bouquetCount[sale.bouquet] =
    (bouquetCount[sale.bouquet] || 0) + sale.quantity;
});

const bestBouquet =
  Object.entries(bouquetCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

const colorCount: Record<string, number> = {};

sales.forEach((sale) => {
  colorCount[sale.color] =
    (colorCount[sale.color] || 0) + sale.quantity;
});

const bestColor =
  Object.entries(colorCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
  const salesChart = sales.map((sale) => ({
  name: sale.bouquet,
  sales: sale.total,
}));
const COLORS = [
  "#ec4899", // pink
  "#3b82f6", // blue
  "#22c55e", // green
  "#f97316", // orange
  "#a855f7", // purple
  "#eab308", // yellow
];
 return (
  <main className="min-h-screen bg-pink-50 flex">

    <Sidebar />

    <div className="flex-1 p-8">
<div className="flex justify-between items-center">
  <div>
    <h1 className="text-5xl font-bold text-pink-600">
  🌸 {businessName}
</h1>

<p className="text-gray-500 mt-2">
  {websiteTitle}
</p>
  </div>

  <button
    onClick={() => signOut({ callbackUrl: "/login" })}
    className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold"
  >
    🚪 Logout
  </button>
</div>
  
<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
         <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100 hover:shadow-xl transition">
           <h2 className="text-gray-500">
  💰 Total Sales
</h2>

            <p className="text-3xl font-bold text-pink-600 mt-3">
              ₱{totalSales.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100 hover:shadow-xl transition">
            <h2 className="text-gray-500">
  💸 Total Expenses
</h2>

            <p className="text-3xl font-bold text-red-500 mt-3">
              ₱{totalExpenses.toLocaleString()}
            </p>
          </div>

         <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100 hover:shadow-xl transition">
           <h2 className="text-gray-500">
  📈 Net Profit
</h2>

            <p className="text-3xl font-bold text-green-600 mt-3">
              ₱{profit.toLocaleString()}
            </p>
          </div>

         <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100 hover:shadow-xl transition">
            <h2 className="text-gray-500">
  🌸 Bouquets Sold
</h2>

            <p className="text-3xl font-bold text-blue-600 mt-3">
              {totalBouquets}
            </p>
          </div>
<div className="grid md:grid-cols-2 gap-6 mt-8">

<div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100 hover:shadow-xl transition">
    <h2 className="text-gray-500">
      🌹 Best Selling Bouquet
    </h2>

    <p className="text-2xl font-bold text-pink-600 mt-3">
      {bestBouquet}
    </p>
  </div>

 <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100 hover:shadow-xl transition">
    <h2 className="text-gray-500">
      🎨 Most Requested Color
    </h2>

    <p className="text-2xl font-bold text-blue-600 mt-3">
      {bestColor}
    </p>
  </div>

</div>
        </div>
<div className="bg-white rounded-3xl shadow-md p-6 mt-8 border border-pink-100">

  <h2 className="text-xl font-bold text-gray-700 mb-5">
    📊 Sales Overview
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={salesChart}>

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Bar dataKey="sales">
  {salesChart.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={COLORS[index % COLORS.length]}
    />
  ))}
</Bar>

    </BarChart>
  </ResponsiveContainer>

</div>
      
            </div>
    </main>
  );
}