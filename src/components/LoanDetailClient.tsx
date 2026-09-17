"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";
import PositionCards from "./PositionCards";
import PaymentForm from "./PaymentForm";
import ScheduleTable from "./ScheduleTable";
import toast from "react-hot-toast";

export default function LoanDetailClient({ loanId }: { loanId: string }) {
  const { user, loading, getToken } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const loadLoan = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(`/api/loans/${loanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load loan details");
      setData(await res.json());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(message);
    }
  }, [getToken, loanId]);

  useEffect(() => {
    if (user?.uid) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadLoan();
    }
  }, [user?.uid, loadLoan]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.success("Payment recorded successfully!");
      await loadLoan();
      loadLoan();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user || !data) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-white">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  const { loan, position, installments } = data;

  return (
    <main className="mx-auto flex w-full flex-1 max-w-5xl flex-col px-4 sm:px-6 py-6 sm:py-8 lg:h-full lg:overflow-hidden">
      <div className="mb-6 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="group flex h-9 cursor-pointer items-center justify-center gap-2 rounded-none border-none bg-transparent px-0 text-sm font-semibold text-gray-600 transition-colors hover:text-black focus:outline-none active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 transition-transform group-hover:-translate-x-0.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back</span>
          </Link>
          <div className="h-4 w-px bg-gray-200"></div>
          <h1 className="text-xl font-bold tracking-tight text-black flex items-center gap-2 whitespace-nowrap">
            Loan <span className="font-mono text-gray-500 text-lg font-normal truncate">#{loanId.split("-")[0]}</span>
          </h1>
        </div>
      </div>

      <div className="shrink-0 mb-8">
        <PositionCards position={position} />
      </div>

      <div className="flex flex-1 flex-col lg:flex-row gap-8 lg:overflow-hidden pb-8">
        <div className="flex-1 lg:overflow-hidden">
          <ScheduleTable installments={installments} />
        </div>
        <div className="w-full lg:w-80 shrink-0">
          <PaymentForm
            amount={amount}
            setAmount={setAmount}
            onSubmit={handlePayment}
            isSubmitting={isSubmitting}
            isClosed={loan.status === "CLOSED"}
          />
        </div>
      </div>
    </main>
  );
}
