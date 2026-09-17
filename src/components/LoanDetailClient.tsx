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
    if (user) loadLoan();
  }, [user, loanId]); 

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
          Authorization: `Bearer ${token}` 
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

  if (loading || !user || (!data && !error)) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const { loan, position, installments } = data;

  return (
    <div className="mx-auto max-w-5xl p-8 text-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold font-mono">Loan: {loanId.split("-")[0]}</h1>
      </div>

      <PositionCards position={position} />
      
      <PaymentForm 
        amount={amount}
        setAmount={setAmount}
        onSubmit={handlePayment}
        isSubmitting={isSubmitting}
        isClosed={loan.status === "CLOSED"}
        error={paymentError}
      />

      <ScheduleTable installments={installments} />
    </div>
  );
}
