"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoanListTable from "./LoanListTable";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function DashboardClient() {
  const { user, loading } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!loading && !user) window.location.href = "/login";
  }, [user, loading]);

  useEffect(() => {
    async function loadLoans() {
      if (!user || hasFetched) return;
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/loans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load loans");
        setLoans(await res.json());
        setHasFetched(true);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    loadLoans();
  }, [user, hasFetched]);

  if (loading || !user) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-white">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return (
    <main className="mx-auto flex w-full flex-1 max-w-5xl flex-col px-4 sm:px-6 py-6 sm:py-8 lg:h-full lg:overflow-hidden">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-black">Active Loans</h1>
      </div>
      
      <div className="flex-1 lg:overflow-hidden pb-8">
        <LoanListTable loans={loans} />
      </div>
    </main>
  );
}
