"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoanListTable from "./LoanListTable";

export default function DashboardClient() {
  const { user, loading, getToken, signOut } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) window.location.href = "/login";
  }, [user, loading]);

  useEffect(() => {
    async function loadLoans() {
      if (!user) return;
      try {
        const token = await getToken();
        const res = await fetch("/api/loans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load loans");
        setLoans(await res.json());
      } catch (err: any) {
        setError(err.message);
      }
    }
    loadLoans();
  }, [user, getToken]);

  if (loading || !user) return <div className="p-8">Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loans Dashboard</h1>
        <button onClick={signOut} className="text-gray-500 hover:text-gray-800">
          Sign Out
        </button>
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <LoanListTable loans={loans} />
    </div>
  );
}
