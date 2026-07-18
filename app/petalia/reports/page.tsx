"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
import * as XLSX from "xlsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSales, getExpenses, Sale, Expense } from "@/lib/storage";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
 const [month, setMonth] = useState("");
  function exportToPDF() {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("The Studio Petalia", 14, 20);

  doc.setFontSize(12);
 doc.text(`Total Sales: PHP ${totalSales.toLocaleString()}`, 14, 35);
doc.text(`Total Expenses: PHP ${totalExpenses.toLocaleString()}`, 14, 45);
doc.text(`Net Profit: PHP ${profit.toLocaleString()}`, 14, 55);
  doc.text(`Best Bouquet: ${bestBouquet}`, 14, 65);
  doc.text(`Best Color: ${bestColor}`, 14, 75);

  autoTable(doc, {
    startY: 90,
    head: [["Date", "Bouquet", "Color", "Qty", "Total"]],
    body: filteredSales.map((sale) => [
      sale.date,
      sale.bouquet,
      sale.color,
      sale.quantity,
      `PHP ${sale.total.toLocaleString()}`,
    ]),
  });

  doc.save("Petalia-Report.pdf");
}
function exportToExcel() {
  const data = filteredSales.map((s) => ({
    Date: s.date,
    Bouquet: s.bouquet,
    Color: s.color,
    Quantity: s.quantity,
    Total: s.total,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

  XLSX.writeFile(workbook, "petalia-sales.xlsx");
}
  useEffect(() => {
  setSales(getSales());
  setExpenses(getExpenses());
}, []);

const filteredSales = month
  ? sales.filter((sale) => sale.date.startsWith(month))
  : sales;

const filteredExpenses = month
  ? expenses.filter((expense) => expense.date.startsWith(month))
  : expenses;

const totalSales = filteredSales.reduce(
  (sum, s) => sum + s.total,
  0
);

const totalExpenses = filteredExpenses.reduce(
  (sum, e) => sum + e.cost,
  0
);

const profit = totalSales - totalExpenses;

  const bouquetCount: Record<string, number> = {};
  const colorCount: Record<string, number> = {};

 filteredSales.forEach((sale) => {
    bouquetCount[sale.bouquet] =
      (bouquetCount[sale.bouquet] || 0) + sale.quantity;

    colorCount[sale.color] =
      (colorCount[sale.color] || 0) + sale.quantity;
  });

  const bestBouquet =
    Object.entries(bouquetCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  const bestColor =
    Object.entries(colorCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
const chartData = {
  labels: filteredSales.map((sale) => sale.date),
  datasets: [
    {
      label: "Sales",
      data: filteredSales.map((sale) => sale.total),
      backgroundColor: filteredSales.map((_, index) => {
        const colors = [
          "#ec4899",
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#8b5cf6",
          "#ef4444",
          "#14b8a6",
          "#f97316",
        ];

        return colors[index % colors.length];
      }),
      borderRadius: 10,
    },
  ],
};

const bouquetData = {
  labels: Object.keys(bouquetCount),
  datasets: [
    {
      data: Object.values(bouquetCount),
      backgroundColor: [
        "#ec4899",
        "#3b82f6",
        "#22c55e",
        "#f59e0b",
        "#8b5cf6",
      ],
    },
  ],
};
  return (
    <main className="min-h-screen bg-pink-50 p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-pink-600">
          📄 Business Report
        </h1>
        
        <div className="mt-6 flex items-center gap-4">
  <label className="font-semibold">
    Filter by Month:
  </label>

  <input
    type="month"
    value={month}
    onChange={(e) => setMonth(e.target.value)}
    className="border rounded-xl px-4 py-2"
  />

  <button
    onClick={() => setMonth("")}
    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
  >
    Clear
  </button>
</div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

          <div className="bg-white rounded-3xl shadow p-6">
            <h2>Total Sales</h2>
            <p className="text-3xl font-bold text-pink-600">
              ₱{totalSales.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h2>Total Expenses</h2>
            <p className="text-3xl font-bold text-red-500">
              ₱{totalExpenses.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h2>Net Profit</h2>
            <p className="text-3xl font-bold text-green-600">
              ₱{profit.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h2>Total Orders</h2>
            <p className="text-3xl font-bold">
              {filteredSales.length}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h2>Best Selling Bouquet</h2>
            <p className="text-2xl font-bold text-pink-600">
              {bestBouquet}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h2>Most Requested Color</h2>
            <p className="text-2xl font-bold text-blue-600">
              {bestColor}
            </p>
          </div>

        </div>
<div className="bg-white rounded-3xl shadow p-6 mt-10">
  <h2 className="text-2xl font-bold mb-4">
    📊 Sales Chart
  </h2>

<Bar
  data={chartData}
  options={{
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  }}
/>  <div className="bg-white rounded-3xl shadow p-6 mt-10">
  <h2 className="text-2xl font-bold mb-4">
    🥧 Bouquet Distribution
  </h2>

  <div className="max-w-md mx-auto">
    <Pie data={bouquetData} />
  </div>
</div>
</div>

<Link
  href="/petalia"
  className="inline-block mt-10 bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600"
>
  ← Back to Dashboard
</Link>

</div>

<div className="mt-10 text-center">
  <button
    onClick={exportToExcel}
    className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-bold"
  >
    📤 Export Sales to Excel
  </button>

  <button
    onClick={exportToPDF}
    className="ml-4 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-bold"
  >
    📄 Export PDF
  </button>
</div>

</main>
  );
}