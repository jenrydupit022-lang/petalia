"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Transaction = {
  id: string;
  date: string;
  particulars: string;
  cashIn: number;
  cashOut: number;
  createdBy: string | null;
};

type UserRole = "treasurer" | "auditor" | "viewer" | null;

export default function ClassFundPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [role, setRole] = useState<UserRole>(null);

  const [date, setDate] = useState("");
  const [particulars, setParticulars] = useState("");
  const [cashIn, setCashIn] = useState("");
  const [cashOut, setCashOut] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pendingEditRequests, setPendingEditRequests] =
    useState(0);

  /* PRINT */

  const [printDate, setPrintDate] = useState("");

  /* EDIT REQUEST MODAL */

  const [requestingId, setRequestingId] =
    useState<string | null>(null);

  const [requestReason, setRequestReason] = useState("");
  const [requestSaving, setRequestSaving] = useState(false);

  /* ================================
     FORMAT MONEY
  ================================= */

  function formatMoney(amount: number) {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  /* ================================
     LOAD USER ROLE
  ================================= */

  async function loadRole() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role, system_access")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Profile error:", error);

      alert(
        "Unable to load your ClassFund permissions."
      );

      return;
    }

    if (
      data.system_access !== "classfund" &&
      data.system_access !== "both"
    ) {
      alert("You do not have access to ClassFund.");

      window.location.href = "/";

      return;
    }

    setRole(data.role as UserRole);
  }

  /* ================================
     LOAD TRANSACTIONS
  ================================= */

  async function loadTransactions() {
    const { data, error } = await supabase
      .from("classfund_transactions")
      .select(
        "id, date, particulars, cash_in, cash_out, created_by, created_at"
      )
      .order("date", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Transaction loading error:",
        error
      );

      alert(
        `Unable to load transactions.\n\n${error.message}`
      );

      return;
    }

    const formattedTransactions: Transaction[] =
      (data || []).map((transaction) => ({
        id: String(transaction.id),
        date: transaction.date,
        particulars: transaction.particulars,
        cashIn: Number(transaction.cash_in) || 0,
        cashOut: Number(transaction.cash_out) || 0,
        createdBy: transaction.created_by,
      }));

    setTransactions(formattedTransactions);
  }

  /* ================================
     LOAD PENDING EDIT REQUESTS
  ================================= */

  async function loadPendingEditRequests() {
    const { count, error } = await supabase
      .from("class_fund_edit_requests")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "pending");

    if (error) {
      console.error(
        "Edit request loading error:",
        error
      );

      return;
    }

    setPendingEditRequests(count || 0);
  }

  /* ================================
     INITIAL LOAD
  ================================= */

  useEffect(() => {
    async function initialize() {
      setLoading(true);

      await loadRole();
      await loadTransactions();
      await loadPendingEditRequests();

      setLoading(false);
    }

    initialize();
  }, []);

  /* ================================
     REFRESH REQUEST COUNT
  ================================= */

  useEffect(() => {
    if (role !== "treasurer") {
      return;
    }

    const interval = setInterval(() => {
      loadPendingEditRequests();
    }, 5000);

    return () => clearInterval(interval);
  }, [role]);

  /* ================================
     TOTALS
  ================================= */

  const totalCashIn = transactions.reduce(
    (total, transaction) =>
      total + transaction.cashIn,
    0
  );

  const totalCashOut = transactions.reduce(
    (total, transaction) =>
      total + transaction.cashOut,
    0
  );

  const fundBalance =
    totalCashIn - totalCashOut;

  /* ================================
     ADD TRANSACTION
  ================================= */

  async function addTransaction() {
    if (role !== "treasurer") {
      alert(
        "Only the Treasurer can add transactions."
      );

      return;
    }

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

    if (
      inputCashIn <= 0 &&
      inputCashOut <= 0
    ) {
      alert(
        "Please enter a Cash In or Cash Out amount."
      );

      return;
    }

    if (
      inputCashIn > 0 &&
      inputCashOut > 0
    ) {
      alert(
        "Please enter only Cash In OR Cash Out."
      );

      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert(
        "Your session has expired. Please login again."
      );

      window.location.href = "/login";

      return;
    }

    const { error } = await supabase
      .from("classfund_transactions")
      .insert({
        date,
        particulars: particulars.trim(),
        cash_in: inputCashIn,
        cash_out: inputCashOut,
        created_by: user.id,
      });

    setSaving(false);

    if (error) {
      console.error(
        "Add transaction error:",
        error
      );

      alert(
        `Unable to add transaction.\n\n${error.message}`
      );

      return;
    }

    setDate("");
    setParticulars("");
    setCashIn("");
    setCashOut("");

    await loadTransactions();
  }

  /* ================================
     DELETE TRANSACTION
  ================================= */

  async function deleteTransaction(id: string) {
    if (role !== "treasurer") {
      alert(
        "Only the Treasurer can delete transactions."
      );

      return;
    }

    const confirmed = confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("classfund_transactions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Delete transaction error:",
        error
      );

      alert(
        `Unable to delete transaction.\n\n${error.message}`
      );

      return;
    }

    await loadTransactions();
  }

  /* ================================
     REQUEST EDIT
  ================================= */

  async function submitEditRequest() {
    if (role !== "auditor") {
      alert(
        "Only the Auditor can request an edit."
      );

      return;
    }

    if (!requestingId) {
      return;
    }

    if (!requestReason.trim()) {
      alert(
        "Please explain why this transaction needs to be edited."
      );

      return;
    }

    setRequestSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert(
        "Your session has expired. Please login again."
      );

      window.location.href = "/login";

      return;
    }

    const { error } = await supabase
      .from("class_fund_edit_requests")
      .insert({
        transaction_id: requestingId,
        requested_by: user.id,
        reason: requestReason.trim(),
        status: "pending",
      });

    setRequestSaving(false);

    if (error) {
      console.error(
        "Edit request error:",
        error
      );

      alert(
        `Unable to submit edit request.\n\n${error.message}`
      );

      return;
    }

    alert(
      "Edit request submitted successfully. The Treasurer must review it."
    );

    setRequestingId(null);
    setRequestReason("");
  }

  /* ================================
     BALANCE
  ================================= */

  function getBalance(index: number) {
    return transactions
      .slice(0, index + 1)
      .reduce(
        (balance, transaction) =>
          balance +
          transaction.cashIn -
          transaction.cashOut,
        0
      );
  }

  /* ================================
     PRINT REPORT
  ================================= */

  function printReport() {
    const now = new Date();

    setPrintDate(
      now.toLocaleString("en-PH", {
        dateStyle: "long",
        timeStyle: "short",
      })
    );

    setTimeout(() => {
      window.print();
    }, 100);
  }

  /* ================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="text-4xl mb-3">
            💰
          </div>

          <p className="text-gray-600">
            Loading ClassFund...
          </p>
        </div>
      </main>
    );
  }

  /* ================================
     PAGE
  ================================= */

  return (
    <main className="min-h-screen bg-pink-50 p-4 sm:p-6 md:p-10">

      {/* ================================
          NORMAL WEBSITE CONTENT
      ================================= */}

      <div className="print:hidden">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-600">
                💰 ClassFund
              </h1>

              <p className="mt-2 text-gray-600">
                Class Treasurer Financial Record
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              {/* TREASURER NOTIFICATION */}

              {role === "treasurer" &&
                pendingEditRequests > 0 && (

                  <Link
                    href="/classfund/edit-requests"
                    className="bg-red-50 border border-red-200 shadow px-4 py-3 rounded-xl text-center hover:bg-red-100 transition cursor-pointer"
                  >
                    <span className="text-xs text-red-500 block">
                      🔔 Pending Edit Requests
                    </span>

                    <span className="font-bold text-red-600">
                      {pendingEditRequests}
                    </span>
                  </Link>

                )}

              {/* ACCESS */}

              <div className="bg-white shadow px-4 py-3 rounded-xl text-center">
                <span className="text-xs text-gray-500 block">
                  Access
                </span>

                <span className="font-bold text-pink-600 capitalize">
                  {role}
                </span>
              </div>

              {/* PRINT */}

              <button
                onClick={printReport}
                className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-xl text-center font-semibold shadow"
              >
                🖨️ Print Report
              </button>

              {/* BACK */}

              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-xl text-center"
              >
                ← Back
              </Link>

            </div>

          </div>

          {/* SUMMARY */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">

            {/* CASH IN */}

            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-green-100">
              <p className="text-gray-500 font-medium">
                💰 Total Cash In
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">
                {formatMoney(totalCashIn)}
              </h2>
            </div>

            {/* CASH OUT */}

            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-red-100">
              <p className="text-gray-500 font-medium">
                💸 Total Cash Out
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mt-2">
                {formatMoney(totalCashOut)}
              </h2>
            </div>

            {/* BALANCE */}

            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-pink-100">
              <p className="text-gray-500 font-medium">
                💵 Fund Balance
              </p>

              <h2
                className={`text-2xl sm:text-3xl font-bold mt-2 ${
                  fundBalance >= 0
                    ? "text-pink-600"
                    : "text-red-600"
                }`}
              >
                {formatMoney(fundBalance)}
              </h2>
            </div>

          </div>

          {/* TREASURER ADD */}

          {role === "treasurer" && (

            <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-6 md:p-8 mb-8">

              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
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
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl p-3 min-h-[48px]"
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
                    onChange={(e) =>
                      setParticulars(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl p-3 min-h-[48px]"
                  />
                </div>

                {/* CASH IN */}

                <div>
                  <label className="block text-sm font-semibold text-green-600 mb-2">
                    💰 Cash In
                  </label>

                  <input
                    type="number"
                    inputMode="decimal"
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
                    className="w-full border border-green-200 rounded-xl p-3 min-h-[48px]"
                  />
                </div>

                {/* CASH OUT */}

                <div>
                  <label className="block text-sm font-semibold text-red-500 mb-2">
                    💸 Cash Out
                  </label>

                  <input
                    type="number"
                    inputMode="decimal"
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
                    className="w-full border border-red-200 rounded-xl p-3 min-h-[48px]"
                  />
                </div>

              </div>

              <button
                onClick={addTransaction}
                disabled={saving}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-bold rounded-xl py-4 mt-6 min-h-[52px]"
              >
                {saving
                  ? "Saving..."
                  : "➕ Add Transaction"}
              </button>

            </div>

          )}

          {/* AUDITOR */}

          {role === "auditor" && (

            <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-6 mb-8 border border-blue-100">

              <h2 className="text-xl font-bold text-gray-800">
                🧾 Auditor Access
              </h2>

              <p className="text-gray-600 mt-2">
                You can review all ClassFund records.
                If a transaction has an error, use{" "}
                <b>Request Edit</b>. The Treasurer must
                approve the request before changes can
                be made.
              </p>

            </div>

          )}

          {/* VIEWER */}

          {role === "viewer" && (

            <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-6 mb-8 border border-gray-100">

              <h2 className="text-xl font-bold text-gray-800">
                👀 View-Only Access
              </h2>

              <p className="text-gray-600 mt-2">
                You can view the ClassFund financial
                records but cannot modify them.
              </p>

            </div>

          )}

          {/* TRANSACTIONS */}

          <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  📋 Fund Transactions
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Complete record of cash movement
                </p>
              </div>

              <div className="bg-pink-50 px-4 py-2 rounded-xl text-sm text-gray-600 w-fit">
                {transactions.length} transaction
                {transactions.length !== 1
                  ? "s"
                  : ""}
              </div>

            </div>

            {/* DESKTOP TABLE */}

            <div className="hidden md:block overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="bg-pink-100 border-b border-pink-200">

                    <th className="p-4 text-left">
                      DATE
                    </th>

                    <th className="p-4 text-left">
                      PARTICULARS
                    </th>

                    <th className="p-4 text-right">
                      CASH IN
                    </th>

                    <th className="p-4 text-right">
                      CASH OUT
                    </th>

                    <th className="p-4 text-right">
                      FUND BALANCE
                    </th>

                    {role !== "viewer" && (
                      <th className="p-4 text-center">
                        ACTION
                      </th>
                    )}

                  </tr>

                </thead>

                <tbody>

                  {transactions.length === 0 ? (

                    <tr>

                      <td
                        colSpan={
                          role !== "viewer"
                            ? 6
                            : 5
                        }
                        className="p-10 text-center text-gray-500"
                      >
                        No transactions yet.
                      </td>

                    </tr>

                  ) : (

                    transactions.map(
                      (transaction, index) => {

                        const balance =
                          getBalance(index);

                        return (

                          <tr
                            key={transaction.id}
                            className="border-b border-gray-200 hover:bg-pink-50"
                          >

                            <td className="p-4 whitespace-nowrap">
                              {transaction.date}
                            </td>

                            <td className="p-4 min-w-[250px]">
                              <span className="font-medium">
                                {transaction.particulars}
                              </span>
                            </td>

                            <td className="p-4 text-right text-green-600 font-semibold">
                              {transaction.cashIn > 0
                                ? formatMoney(
                                    transaction.cashIn
                                  )
                                : "—"}
                            </td>

                            <td className="p-4 text-right text-red-500 font-semibold">
                              {transaction.cashOut > 0
                                ? formatMoney(
                                    transaction.cashOut
                                  )
                                : "—"}
                            </td>

                            <td className="p-4 text-right font-bold">
                              {formatMoney(balance)}
                            </td>

                            <td className="p-4 text-center">

                              {role === "treasurer" && (

                                <button
                                  onClick={() =>
                                    deleteTransaction(
                                      transaction.id
                                    )
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                                >
                                  Delete
                                </button>

                              )}

                              {role === "auditor" && (

                                <button
                                  onClick={() => {
                                    setRequestingId(
                                      transaction.id
                                    );

                                    setRequestReason("");
                                  }}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                                >
                                  Request Edit
                                </button>

                              )}

                            </td>

                          </tr>

                        );
                      }
                    )

                  )}

                </tbody>

                {/* TOTAL */}

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

                      {role !== "viewer" && (
                        <td></td>
                      )}

                    </tr>

                  </tfoot>

                )}

              </table>

            </div>

            {/* MOBILE */}

            <div className="md:hidden space-y-4">

              {transactions.length === 0 ? (

                <div className="p-8 text-center text-gray-500 border rounded-2xl">
                  No transactions yet.
                </div>

              ) : (

                transactions.map(
                  (transaction, index) => {

                    const balance =
                      getBalance(index);

                    return (

                      <div
                        key={transaction.id}
                        className="border border-gray-200 rounded-2xl p-4 shadow-sm"
                      >

                        <div className="flex justify-between items-start gap-3 mb-3">

                          <div>
                            <p className="text-xs text-gray-500">
                              DATE
                            </p>

                            <p className="font-semibold">
                              {transaction.date}
                            </p>
                          </div>

                          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            {formatMoney(balance)}
                          </div>

                        </div>

                        <div className="mb-4">

                          <p className="text-xs text-gray-500 mb-1">
                            PARTICULARS
                          </p>

                          <p className="font-medium break-words">
                            {transaction.particulars}
                          </p>

                        </div>

                        <div className="grid grid-cols-2 gap-3">

                          <div className="bg-green-50 rounded-xl p-3">

                            <p className="text-xs text-green-700">
                              CASH IN
                            </p>

                            <p className="font-bold text-green-600 mt-1">
                              {transaction.cashIn > 0
                                ? formatMoney(
                                    transaction.cashIn
                                  )
                                : "—"}
                            </p>

                          </div>

                          <div className="bg-red-50 rounded-xl p-3">

                            <p className="text-xs text-red-700">
                              CASH OUT
                            </p>

                            <p className="font-bold text-red-500 mt-1">
                              {transaction.cashOut > 0
                                ? formatMoney(
                                    transaction.cashOut
                                  )
                                : "—"}
                            </p>

                          </div>

                        </div>

                        {role === "treasurer" && (

                          <button
                            onClick={() =>
                              deleteTransaction(
                                transaction.id
                              )
                            }
                            className="w-full bg-red-500 text-white py-3 rounded-xl mt-4 font-semibold"
                          >
                            Delete Transaction
                          </button>

                        )}

                        {role === "auditor" && (

                          <button
                            onClick={() => {
                              setRequestingId(
                                transaction.id
                              );

                              setRequestReason("");
                            }}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl mt-4 font-semibold"
                          >
                            📝 Request Edit
                          </button>

                        )}

                      </div>

                    );
                  }
                )

              )}

              {/* MOBILE TOTAL */}

              {transactions.length > 0 && (

                <div className="bg-pink-50 rounded-2xl p-5 border border-pink-100">

                  <p className="font-bold text-gray-700 mb-4">
                    TOTAL
                  </p>

                  <div className="space-y-3">

                    <div className="flex justify-between gap-3">

                      <span className="text-gray-600">
                        Total Cash In
                      </span>

                      <span className="font-bold text-green-600">
                        {formatMoney(totalCashIn)}
                      </span>

                    </div>

                    <div className="flex justify-between gap-3">

                      <span className="text-gray-600">
                        Total Cash Out
                      </span>

                      <span className="font-bold text-red-500">
                        {formatMoney(totalCashOut)}
                      </span>

                    </div>

                    <div className="border-t pt-3 flex justify-between gap-3">

                      <span className="font-bold text-gray-700">
                        Fund Balance
                      </span>

                      <span className="font-bold text-pink-600">
                        {formatMoney(fundBalance)}
                      </span>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>
      </div>

      {/* ================================
          PRINTABLE FINANCIAL REPORT
      ================================= */}

      <div className="hidden print:block bg-white text-black">

        <div className="max-w-full mx-auto">

          {/* REPORT HEADER */}

          <div className="text-center border-b-2 border-black pb-5 mb-6">

            <h1 className="text-3xl font-bold tracking-wide">
              CLASSFUND FINANCIAL REPORT
            </h1>

            <p className="text-lg font-semibold mt-2">
              Class Treasurer Financial Record
            </p>

            <p className="text-sm mt-2">
              Official Record of Cash Receipts and Disbursements
            </p>

            {printDate && (
              <p className="text-sm mt-2">
                Printed: {printDate}
              </p>
            )}

          </div>

          {/* SUMMARY */}

          <div className="grid grid-cols-3 gap-4 mb-8">

            <div className="border border-black p-4">
              <p className="text-sm font-semibold">
                TOTAL CASH IN
              </p>

              <p className="text-xl font-bold mt-2">
                {formatMoney(totalCashIn)}
              </p>
            </div>

            <div className="border border-black p-4">
              <p className="text-sm font-semibold">
                TOTAL CASH OUT
              </p>

              <p className="text-xl font-bold mt-2">
                {formatMoney(totalCashOut)}
              </p>
            </div>

            <div className="border border-black p-4">
              <p className="text-sm font-semibold">
                FUND BALANCE
              </p>

              <p className="text-xl font-bold mt-2">
                {formatMoney(fundBalance)}
              </p>
            </div>

          </div>

          {/* TRANSACTION TABLE */}

          <table className="w-full border-collapse border border-black text-sm">

            <thead>

              <tr className="border-b-2 border-black">

                <th className="border border-black p-3 text-left">
                  DATE
                </th>

                <th className="border border-black p-3 text-left">
                  PARTICULARS
                </th>

                <th className="border border-black p-3 text-right">
                  CASH IN
                </th>

                <th className="border border-black p-3 text-right">
                  CASH OUT
                </th>

                <th className="border border-black p-3 text-right">
                  FUND BALANCE
                </th>

              </tr>

            </thead>

            <tbody>

              {transactions.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="border border-black p-5 text-center"
                  >
                    No transactions recorded.
                  </td>

                </tr>

              ) : (

                transactions.map(
                  (transaction, index) => (

                    <tr
                      key={transaction.id}
                      className="border-b border-black"
                    >

                      <td className="border border-black p-3">
                        {transaction.date}
                      </td>

                      <td className="border border-black p-3">
                        {transaction.particulars}
                      </td>

                      <td className="border border-black p-3 text-right">
                        {transaction.cashIn > 0
                          ? formatMoney(
                              transaction.cashIn
                            )
                          : "—"}
                      </td>

                      <td className="border border-black p-3 text-right">
                        {transaction.cashOut > 0
                          ? formatMoney(
                              transaction.cashOut
                            )
                          : "—"}
                      </td>

                      <td className="border border-black p-3 text-right font-semibold">
                        {formatMoney(
                          getBalance(index)
                        )}
                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

            <tfoot>

              <tr className="font-bold">

                <td
                  colSpan={2}
                  className="border border-black p-3 text-right"
                >
                  TOTAL
                </td>

                <td className="border border-black p-3 text-right">
                  {formatMoney(totalCashIn)}
                </td>

                <td className="border border-black p-3 text-right">
                  {formatMoney(totalCashOut)}
                </td>

                <td className="border border-black p-3 text-right">
                  {formatMoney(fundBalance)}
                </td>

              </tr>

            </tfoot>

          </table>

          {/* CERTIFICATION */}

          <div className="mt-8 text-sm">

            <p>
              <strong>Certification:</strong>
            </p>

            <p className="mt-2 leading-relaxed">
              I hereby certify that the above financial report
              represents the recorded cash transactions of the
              ClassFund and that the balances shown are based on
              the transactions recorded in the system.
            </p>

          </div>

         {/* SIGNATURES */}

<div className="grid grid-cols-3 gap-10 mt-16">

  {/* TREASURER */}
  <div className="text-center">
    <div className="h-10"></div>
    <div className="border-b border-black mb-2"></div>

    <p className="text-sm font-semibold">
      PREPARED BY
    </p>

    <p className="font-bold mt-1">
      TREASURER
    </p>
  </div>

  {/* AUDITOR */}
  <div className="text-center">
    <div className="h-10"></div>
    <div className="border-b border-black mb-2"></div>

    <p className="text-sm font-semibold">
      PREPARED BY
    </p>

    <p className="font-bold mt-1">
      AUDITOR
    </p>
  </div>

  {/* PRESIDENT */}
  <div className="text-center">
    <div className="h-10"></div>
    <div className="border-b border-black mb-2"></div>

    <p className="text-sm font-semibold">
      CHECKED AND VERIFIED BY
    </p>

    <p className="font-bold mt-1">
      PRESIDENT
    </p>
  </div>

</div>
{/* Adviser */}
  <div className="text-center">
    <div className="h-10"></div>
     <div className="w-48 mx-auto border-b border-black mb-2"></div>


    <p className="text-sm font-semibold">
      CHECKED AND VERIFIED BY
    </p>

    <p className="font-bold mt-1">
      ADVISER
    </p>
  </div>

</div>

        </div>

      

      {/* ================================
          EDIT REQUEST MODAL
      ================================= */}

      {requestingId && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 print:hidden">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">

            <h2 className="text-2xl font-bold text-gray-800">
              📝 Request Edit
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Explain what needs to be corrected.
            </p>

            <textarea
              value={requestReason}
              onChange={(e) =>
                setRequestReason(e.target.value)
              }
              placeholder="Example: Cash Out should be ₱500 instead of ₱550."
              rows={5}
              className="w-full border border-gray-300 rounded-xl p-3 mt-5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-5">

              <button
                onClick={() => {
                  setRequestingId(null);
                  setRequestReason("");
                }}
                className="w-full border border-gray-300 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={submitEditRequest}
                disabled={requestSaving}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold"
              >
                {requestSaving
                  ? "Submitting..."
                  : "Submit Request"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================================
          PRINT CSS
      ================================= */}

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          html,
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          table {
            page-break-inside: auto;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          thead {
            display: table-header-group;
          }

          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>

    </main>
  );
}