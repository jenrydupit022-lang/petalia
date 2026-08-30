"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [businessName, setBusinessName] =
    useState("The Studio Petalia");

  const [websiteTitle, setWebsiteTitle] =
    useState("Flower Shop Management Dashboard");

  /* =========================
     CHECK PETALIA ACCESS
  ========================= */

  useEffect(() => {
    async function checkAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // No logged-in user
      if (!user) {
        router.replace("/login");
        return;
      }

      // Get user's profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, system_access")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        console.error("Profile error:", error);
        router.replace("/");
        return;
      }

      // Only users with Petalia access can enter
      if (
        profile.system_access !== "petalia" &&
        profile.system_access !== "both"
      ) {
        alert("You don't have permission to access Studio Petalia.");
        router.replace("/");
        return;
      }

      setAllowed(true);
      setCheckingAccess(false);
    }

    checkAccess();
  }, [router]);

  /* =========================
     LOAD PETALIA DATA
     ========================= */

  useEffect(() => {
    if (!allowed) return;

    setSales(getSales());

    const storedExpenses = JSON.parse(
      localStorage.getItem("expenses") || "[]"
    );

    setExpenses(storedExpenses);

    setBusinessName(
      localStorage.getItem("businessName") ||
        "The Studio Petalia"
    );

    setWebsiteTitle(
      localStorage.getItem("websiteTitle") ||
        "Flower Shop Management Dashboard"
    );
  }, [allowed]);

  /* =========================
     LOADING
     ========================= */

  if (checkingAccess) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🌸</div>

          <p className="text-pink-600 font-semibold">
            Checking access...
          </p>
        </div>
      </main>
    );
  }

  if (!allowed) {
    return null;
  }

  /* =========================
     CALCULATIONS
     ========================= */

  const totalSales = sales.reduce(
    (sum, sale) => sum + sale.total,
    0
  );

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
      (bouquetCount[sale.bouquet] || 0) +
      sale.quantity;
  });

  const bestBouquet =
    Object.entries(bouquetCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "None";

  const colorCount: Record<string, number> = {};

  sales.forEach((sale) => {
    colorCount[sale.color] =
      (colorCount[sale.color] || 0) +
      sale.quantity;
  });

  const bestColor =
    Object.entries(colorCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "None";

  const salesChart = sales.map((sale) => ({
    name: sale.bouquet,
    sales: sale.total,
  }));

  const COLORS = [
    "#ec4899",
    "#3b82f6",
    "#22c55e",
    "#f97316",
    "#a855f7",
    "#eab308",
  ];

  /* =========================
     PAGE
     ========================= */

  return (
    <main className="min-h-screen bg-pink-50 flex">

      <Sidebar />

      <div className="flex-1 p-4 md:p-8">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">

          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-pink-600">
              🌸 {businessName}
            </h1>

            <p className="text-sm md:text-base text-gray-500 mt-2">
              {websiteTitle}
            </p>
          </div>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/login");
            }}
            className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold"
          >
            🚪 Logout
          </button>

        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100 hover:shadow-xl transition">
            <h2 className="text-gray-500">
              💰 Total Sales
            </h2>

            <p className="text-3xl font-bold text-pink-600 mt-3">
              ₱{totalSales.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100 hover:shadow-xl transition">
            <h2 className="text-gray-500">
              💸 Total Expenses
            </h2>

            <p className="text-3xl font-bold text-red-500 mt-3">
              ₱{totalExpenses.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100 hover:shadow-xl transition">
            <h2 className="text-gray-500">
              📈 Net Profit
            </h2>

            <p className="text-3xl font-bold text-green-600 mt-3">
              ₱{profit.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
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

        </div>

        {/* BEST SELLERS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100">
            <h2 className="text-gray-500">
              🌹 Best Selling Bouquet
            </h2>

            <p className="text-2xl font-bold text-pink-600 mt-3">
              {bestBouquet}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100">
            <h2 className="text-gray-500">
              🎨 Most Requested Color
            </h2>

            <p className="text-2xl font-bold text-blue-600 mt-3">
              {bestColor}
            </p>
          </div>

        </div>

        {/* SALES CHART */}

        <div className="bg-white rounded-3xl shadow-md p-6 mt-8 border border-pink-100">

          <h2 className="text-xl font-bold text-gray-700 mb-5">
            📊 Sales Overview
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={salesChart}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="sales">
                {salesChart.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      COLORS[index % COLORS.length]
                    }
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