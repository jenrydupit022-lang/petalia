"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Transaction = {
  id: number;
  date: string;
  particulars: string;
  cashIn: number;
  cashOut: number;
};

export default function ClassFundPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [date, setDate] = useState("");
  const [particulars, setParticulars] = useState("");
  const [cashIn, setCashIn] = useState("");
  const [cashOut, setCashOut] = useState("");

  /* LOAD SAVED TRANSACTIONS */
  useEffect(() => {
    const saved = localStorage.getItem("classFundTransactions");

    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch {
        setTransactions([]);
      }
    }
  }, []);

  /* SAVE TRANSACTIONS */
  useEffect(() => {
    localStorage.setItem(
      "classFundTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  /* TOTALS */
  const totalCashIn = transactions.reduce(
    (total, transaction) => total + transaction.cashIn,
    0
  );

  const totalCashOut = transactions.reduce(
    (total, transaction) => total + transaction.cashOut,
    0
  );

  const fundBalance = totalCashIn - totalCashOut;

  /* FORMAT MONEY */
  function formatMoney(amount: number) {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  /* ADD TRANSACTION */
  function addTransaction() {
    if (!date) {
      alert("Please select a date.");
      return;
    }

    if (!particulars.trim()) {
      alert("Please enter the particulars.");
      return;
    }

    const inputCashIn = Number(cashIn) || 0;
    const inputCashOut = Number(cashOut) || 0;

    if (inputCashIn <= 0 && inputCashOut <= 0) {
      alert("Please enter a Cash In or Cash Out amount.");
      return;
    }

    if (inputCashIn > 0 && inputCashOut > 0) {
      alert("Please enter only Cash In OR Cash Out.");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      date,
      particulars: particulars.trim(),
      cashIn: inputCashIn,
      cashOut: inputCashOut,
    };

    setTransactions((current) => [
      ...current,
      newTransaction,
    ]);

    setDate("");
    setParticulars("");
    setCashIn("");
    setCashOut("");
  }

  /* DELETE TRANSACTION */
  function deleteTransaction(id: number) {
    const confirmed = confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    );
  }

  /* CALCULATE BALANCE PER ROW */
  function getBalance(index: number) {
    return transactions
      .slice(0, index + 1)
      .reduce(
        (balance, transaction) =>
          balance + transaction.cashIn - transaction.cashOut,
        0
      );
  }

  return (
    <main className="min-h-screen bg-pink-50 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-pink-600">
              💰 ClassFund
            </h1>

            <p className="mt-2 text-gray-600">
              Class Treasurer Financial Record
            </p>
          </div>

          <Link
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-xl text-center"
          >
            ← Back to Business Hub
          </Link>

        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* CASH IN */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">

            <p className="text-gray-500 font-medium">
              💰 Total Cash In
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {formatMoney(totalCashIn)}
            </h2>

          </div>

          {/* CASH OUT */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">

            <p className="text-gray-500 font-medium">
              💸 Total Cash Out
            </p>

            <h2 className="text-3xl font-bold text-red-500 mt-2">
              {formatMoney(totalCashOut)}
            </h2>

          </div>

          {/* BALANCE */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">

            <p className="text-gray-500 font-medium">
              💵 Fund Balance
            </p>

            <h2
              className={`text-3xl font-bold mt-2 ${
                fundBalance >= 0
                  ? "text-pink-600"
                  : "text-red-600"
              }`}
            >
              {formatMoney(fundBalance)}
            </h2>

          </div>

        </div>

        {/* ADD TRANSACTION */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            ➕ Add Transaction
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* DATE */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            {/* PARTICULARS */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Particulars
              </label>

              <input
                type="text"
                placeholder="Example: MST 2A Pending Payments"
                value={particulars}
                onChange={(e) => setParticulars(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            {/* CASH IN */}
            <div>
              <label className="block text-sm font-semibold text-green-600 mb-2">
                💰 Cash In
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={cashIn}
                onChange={(e) => {
                  setCashIn(e.target.value);

                  if (e.target.value) {
                    setCashOut("");
                  }
                }}
                className="w-full border border-green-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* CASH OUT */}
            <div>
              <label className="block text-sm font-semibold text-red-500 mb-2">
                💸 Cash Out
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={cashOut}
                onChange={(e) => {
                  setCashOut(e.target.value);

                  if (e.target.value) {
                    setCashIn("");
                  }
                }}
                className="w-full border border-red-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

          </div>

          <p className="text-sm text-gray-500 mt-4">
            💡 Enter an amount in <b>Cash In</b> for money received, or{" "}
            <b>Cash Out</b> for money spent.
          </p>

          <button
            onClick={addTransaction}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl py-4 mt-6"
          >
            ➕ Add Transaction
          </button>

        </div>

        {/* TRANSACTION TABLE */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                📋 Fund Transactions
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Complete record of cash movement
              </p>
            </div>

            <div className="bg-pink-50 px-4 py-2 rounded-xl text-sm text-gray-600">
              {transactions.length} transaction
              {transactions.length !== 1 ? "s" : ""}
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-pink-100 border-b border-pink-200">

                  <th className="p-4 text-left font-bold">
                    DATE
                  </th>

                  <th className="p-4 text-left font-bold">
                    PARTICULARS
                  </th>

                  <th className="p-4 text-right font-bold">
                    CASH IN
                  </th>

                  <th className="p-4 text-right font-bold">
                    CASH OUT
                  </th>

                  <th className="p-4 text-right font-bold">
                    FUND BALANCE
                  </th>

                  <th className="p-4 text-center font-bold">
                    ACTION
                  </th>

                </tr>

              </thead>

              <tbody>

                {transactions.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="p-10 text-center text-gray-500"
                    >
                      No transactions yet.
                      <br />
                      Add your first Cash In or Cash Out above.
                    </td>

                  </tr>

                ) : (

                  transactions.map((transaction, index) => {

                    const balance = getBalance(index);

                    return (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-200 hover:bg-pink-50"
                      >

                        {/* DATE */}
                        <td className="p-4 whitespace-nowrap">
                          {transaction.date}
                        </td>

                        {/* PARTICULARS */}
                        <td className="p-4 min-w-[250px]">
                          <span className="font-medium text-gray-800">
                            {transaction.particulars}
                          </span>
                        </td>

                        {/* CASH IN */}
                        <td className="p-4 text-right text-green-600 font-semibold whitespace-nowrap">
                          {transaction.cashIn > 0
                            ? formatMoney(transaction.cashIn)
                            : "—"}
                        </td>

                        {/* CASH OUT */}
                        <td className="p-4 text-right text-red-500 font-semibold whitespace-nowrap">
                          {transaction.cashOut > 0
                            ? formatMoney(transaction.cashOut)
                            : "—"}
                        </td>

                        {/* BALANCE */}
                        <td
                          className={`p-4 text-right font-bold whitespace-nowrap ${
                            balance < 0
                              ? "text-red-600"
                              : "text-gray-800"
                          }`}
                        >
                          {formatMoney(balance)}
                        </td>

                        {/* DELETE */}
                        <td className="p-4 text-center">

                          <button
                            onClick={() =>
                              deleteTransaction(transaction.id)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

              {/* TOTAL ROW */}
              {transactions.length > 0 && (
                <tfoot>

                  <tr className="bg-gray-50 border-t-2 border-gray-300">

                    <td
                      colSpan={2}
                      className="p-4 font-bold text-right"
                    >
                      TOTAL
                    </td>

                    <td className="p-4 text-right font-bold text-green-600">
                      {formatMoney(totalCashIn)}
                    </td>

                    <td className="p-4 text-right font-bold text-red-500">
                      {formatMoney(totalCashOut)}
                    </td>

                    <td className="p-4 text-right font-bold text-pink-600">
                      {formatMoney(fundBalance)}
                    </td>

                    <td></td>

                  </tr>

                </tfoot>
              )}

            </table>

          </div>

        </div>

      </div>

    </main>
  );
}