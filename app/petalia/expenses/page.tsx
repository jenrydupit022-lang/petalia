"use client";

import { useEffect, useState } from "react";
import {
  saveExpense,
  getExpenses,
  deleteExpense,
  Expense,
} from "@/lib/storage";

export default function ExpensesPage() {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Flowers");
  const [item, setItem] = useState("");
  const [cost, setCost] = useState(0);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    refreshExpenses();
  }, []);

  function refreshExpenses() {
    setExpenses(getExpenses());
  }

  function handleSave() {
    saveExpense({
      id: Date.now(),
      date,
      category,
      item,
      cost,
    });

    refreshExpenses();

    alert("✅ Expense Saved!");

    setDate("");
    setCategory("Flowers");
    setItem("");
    setCost(0);
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this expense?")) return;

    deleteExpense(id);
    refreshExpenses();
  }

  return (
    <main className="min-h-screen bg-pink-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-pink-600 mb-8">
          💸 Monthly Expenses
        </h1>

        <div className="space-y-5">

          <input
            type="date"
            className="w-full border rounded-xl p-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            className="w-full border rounded-xl p-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Flowers</option>
            <option>Wrapping</option>
            <option>Ribbon</option>
            <option>Supplies</option>
            <option>Delivery</option>
            <option>Others</option>
          </select>

          <input
            className="w-full border rounded-xl p-3"
            placeholder="Item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />

          <input
            type="number"
            className="w-full border rounded-xl p-3"
            placeholder="Cost"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />

        </div>

        <button
          onClick={handleSave}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-4 mt-8"
        >
          Save Expense
        </button>

        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-4">
            Expense History
          </h2>

          <table className="w-full border border-gray-200">

            <thead className="bg-pink-100">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-right">Cost</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>

              {expenses.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-gray-500"
                  >
                    No expenses yet.
                  </td>
                </tr>
              )}

              {expenses.map((expense) => (
                <tr key={expense.id} className="border-t">

                  <td className="p-3">{expense.date}</td>

                  <td className="p-3">{expense.category}</td>

                  <td className="p-3">{expense.item}</td>

                  <td className="p-3 text-right">
                    ₱{expense.cost.toLocaleString()}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}