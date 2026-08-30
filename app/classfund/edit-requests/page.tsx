"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type EditRequest = {
  id: string;
  transaction_id: string;
  requested_by: string;
  reason: string;
  status: string;
  created_at: string;
  transaction?: {
    date: string;
    particulars: string;
    cash_in: number;
    cash_out: number;
  } | null;
};

export default function EditRequestsPage() {
  const [requests, setRequests] = useState<EditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  /* ================================
     CHECK TREASURER
  ================================= */

  async function checkTreasurer() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return false;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role, system_access")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      console.error("Profile error:", error);

      alert("Unable to load your permissions.");

      window.location.href = "/classfund";

      return false;
    }

    if (
      data.role !== "treasurer" ||
      (data.system_access !== "classfund" &&
        data.system_access !== "both")
    ) {
      alert(
        "Only the Treasurer can access Edit Requests."
      );

      window.location.href = "/classfund";

      return false;
    }

    return true;
  }

  /* ================================
     LOAD REQUESTS
  ================================= */

  async function loadRequests() {
    setLoading(true);

    const allowed = await checkTreasurer();

    if (!allowed) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("class_fund_edit_requests")
      .select(`
        id,
        transaction_id,
        requested_by,
        reason,
        status,
        created_at,
        classfund_transactions (
          date,
          particulars,
          cash_in,
          cash_out
        )
      `)
      .eq("status", "pending")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Load requests error:", error);

      alert(
        `Unable to load edit requests.\n\n${error.message}`
      );

      setLoading(false);

      return;
    }

    const formatted: EditRequest[] =
      (data || []).map((request: any) => {
        const transaction =
          Array.isArray(
            request.classfund_transactions
          )
            ? request.classfund_transactions[0]
            : request.classfund_transactions;

        return {
          id: String(request.id),

          transaction_id:
            String(request.transaction_id),

          requested_by:
            String(request.requested_by),

          reason: request.reason || "",

          status: request.status,

          created_at: request.created_at,

          transaction: transaction
            ? {
                date: transaction.date,

                particulars:
                  transaction.particulars,

                cash_in:
                  Number(transaction.cash_in) || 0,

                cash_out:
                  Number(transaction.cash_out) || 0,
              }
            : null,
        };
      });

    setRequests(formatted);

    setLoading(false);
  }

  /* ================================
     INITIAL LOAD
  ================================= */

  useEffect(() => {
    loadRequests();
  }, []);

  /* ================================
     ACCEPT REQUEST
  ================================= */

  async function acceptRequest(
    request: EditRequest
  ) {
    if (processingId) {
      return;
    }

    const confirmed = confirm(
      "Accept this edit request?\n\nThe request will be marked as approved."
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(request.id);

    const { data, error } = await supabase
      .from("class_fund_edit_requests")
      .update({
        status: "approved",
      })
      .eq("id", request.id)
      .eq("status", "pending")
      .select("id, status")
      .single();

    if (error) {
      console.error(
        "Approve request error:",
        error
      );

      alert(
        `Unable to approve request.\n\n${error.message}`
      );

      setProcessingId(null);

      return;
    }

    if (!data) {
      alert(
        "The request was not updated. It may already have been processed or you may not have permission."
      );

      setProcessingId(null);

      return;
    }

    alert(
      "Edit request approved successfully."
    );

    setProcessingId(null);

    await loadRequests();
  }

  /* ================================
     REJECT REQUEST
  ================================= */

  async function rejectRequest(
    request: EditRequest
  ) {
    if (processingId) {
      return;
    }

    const confirmed = confirm(
      "Reject this edit request?"
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(request.id);

    const { data, error } = await supabase
      .from("class_fund_edit_requests")
      .update({
        status: "rejected",
      })
      .eq("id", request.id)
      .eq("status", "pending")
      .select("id, status")
      .single();

    if (error) {
      console.error(
        "Reject request error:",
        error
      );

      alert(
        `Unable to reject request.\n\n${error.message}`
      );

      setProcessingId(null);

      return;
    }

    if (!data) {
      alert(
        "The request was not updated. It may already have been processed or you may not have permission."
      );

      setProcessingId(null);

      return;
    }

    alert(
      "Edit request rejected."
    );

    setProcessingId(null);

    await loadRequests();
  }

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
     LOADING SCREEN
  ================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="text-4xl mb-3">
            🔔
          </div>

          <p className="text-gray-600">
            Loading edit requests...
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
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-pink-600">
              🔔 Edit Requests
            </h1>

            <p className="text-gray-600 mt-2">
              Review edit requests submitted by
              the Auditor.
            </p>
          </div>

          <Link
            href="/classfund"
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-xl text-center font-semibold"
          >
            ← Back to ClassFund
          </Link>

        </div>

        {/* REQUEST COUNT */}

        <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">

          <p className="text-sm text-gray-500">
            Pending Requests
          </p>

          <p className="text-3xl font-bold text-red-600 mt-1">
            {requests.length}
          </p>

        </div>

        {/* NO REQUESTS */}

        {requests.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

            <div className="text-5xl mb-4">
              ✅
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              No Pending Requests
            </h2>

            <p className="text-gray-500 mt-2">
              There are currently no edit requests
              waiting for approval.
            </p>

          </div>

        ) : (

          /* REQUEST LIST */

          <div className="space-y-5">

            {requests.map((request) => (

              <div
                key={request.id}
                className="bg-white rounded-3xl shadow-xl p-5 sm:p-7 border border-red-100"
              >

                {/* REQUEST HEADER */}

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                  <div>

                    <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                      PENDING
                    </span>

                    <h2 className="text-xl font-bold text-gray-800 mt-3">
                      Edit Request
                    </h2>

                    <p className="text-xs text-gray-400 mt-1 break-all">
                      Request ID: {request.id}
                    </p>

                  </div>

                  <div className="text-sm text-gray-500">
                    {new Date(
                      request.created_at
                    ).toLocaleString("en-PH")}
                  </div>

                </div>

                {/* TRANSACTION */}

                <div className="bg-gray-50 rounded-2xl p-5 mt-5">

                  <p className="text-xs text-gray-500 font-semibold">
                    TRANSACTION
                  </p>

                  {request.transaction ? (

                    <>
                      <p className="font-bold text-gray-800 mt-2">
                        {request.transaction.particulars}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Date:{" "}
                        {request.transaction.date}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mt-4">

                        {/* CASH IN */}

                        <div className="bg-green-50 rounded-xl p-3">

                          <p className="text-xs text-green-700">
                            CASH IN
                          </p>

                          <p className="font-bold text-green-600">
                            {request.transaction
                              .cash_in > 0
                              ? formatMoney(
                                  request.transaction
                                    .cash_in
                                )
                              : "—"}
                          </p>

                        </div>

                        {/* CASH OUT */}

                        <div className="bg-red-50 rounded-xl p-3">

                          <p className="text-xs text-red-700">
                            CASH OUT
                          </p>

                          <p className="font-bold text-red-500">
                            {request.transaction
                              .cash_out > 0
                              ? formatMoney(
                                  request.transaction
                                    .cash_out
                                )
                              : "—"}
                          </p>

                        </div>

                      </div>
                    </>

                  ) : (

                    <p className="text-red-500 mt-2">
                      Transaction no longer exists.
                    </p>

                  )}

                </div>

                {/* REASON */}

                <div className="mt-5">

                  <p className="text-xs text-gray-500 font-semibold">
                    AUDITOR&apos;S REASON
                  </p>

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mt-2">

                    <p className="text-gray-700 whitespace-pre-wrap">
                      {request.reason}
                    </p>

                  </div>

                </div>

                {/* ACTION BUTTONS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">

                  {/* REJECT */}

                  <button
                    onClick={() =>
                      rejectRequest(request)
                    }
                    disabled={
                      processingId !== null
                    }
                    className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-4 rounded-xl transition"
                  >
                    {processingId === request.id
                      ? "Processing..."
                      : "✕ Reject Request"}
                  </button>

                  {/* ACCEPT */}

                  <button
                    onClick={() =>
                      acceptRequest(request)
                    }
                    disabled={
                      processingId !== null
                    }
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-4 rounded-xl transition"
                  >
                    {processingId === request.id
                      ? "Processing..."
                      : "✓ Accept Request"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </main>
  );
}