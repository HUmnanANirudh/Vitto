"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoanListTable from "./LoanListTable";

import { auth } from "@/lib/firebase";

export default function DashboardClient() {
  const { user, loading, signOut } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [error, setError] = useState("");
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
        setError(err.message);
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
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-blue-600"></div>
            <span className="text-xl font-bold tracking-tight">Vitto LMS</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">{user.email}</span>
            <button 
              onClick={signOut} 
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Loans Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your active loans and payment schedules.</p>
        </div>
        
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
        
        <LoanListTable loans={loans} />
      </main>
    </div>
  );
}
