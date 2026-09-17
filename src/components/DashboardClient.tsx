"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoanListTable from "./LoanListTable";
import { auth } from "@/lib/firebase";
import Navbar from "./Navbar";
import toast from "react-hot-toast";

export default function DashboardClient() {
  const { user, loading, signOut } = useAuth();
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Loans Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your active loans and payment schedules.</p>
        </div>
        
        <LoanListTable loans={loans} />
      </main>
    </div>
  );
}
