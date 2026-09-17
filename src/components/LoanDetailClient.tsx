"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import PositionCards from "./PositionCards";
import PaymentForm from "./PaymentForm";
import ScheduleTable from "./ScheduleTable";

export default function LoanDetailClient({ loanId }: { loanId: string }) {
  const { user, loading, getToken } = useAuth();

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const [amount, setAmount] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) window.location.href = "/login";
  }, [user, loading]);

  const loadLoan = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`/api/loans/${loanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load loan details");
      setData(await res.json());
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (user?.uid) loadLoan();
  }, [user?.uid, loanId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");
    setIsSubmitting(true);

    try {
      const token = await getToken();
      const res = await fetch(`/api/loans/${loanId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reference: crypto.randomUUID(),
          amountPaise: Math.round(parseFloat(amount) * 100),
          receivedAt: new Date().toISOString(),
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Payment failed");

      setAmount("");
      await loadLoan();
    } catch (err: any) {
      setPaymentError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user || (!data && !error)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  const { loan, position, installments } = data;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-blue-600"></div>
            <span className="text-xl font-bold tracking-tight">Vitto LMS</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">{user.email}</span>
            <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="font-mono text-gray-900">{loanId.split("-")[0]}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Loan Details
          </h1>
        </div>

        <PositionCards position={position} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ScheduleTable installments={installments} />
          </div>
          <div className="lg:col-span-1">
            <PaymentForm
              amount={amount}
              setAmount={setAmount}
              onSubmit={handlePayment}
              isSubmitting={isSubmitting}
              isClosed={loan.status === "CLOSED"}
              error={paymentError}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
