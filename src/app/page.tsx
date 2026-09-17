import Link from "next/link";

export default function Landing() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-xl text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900">
          Vitto LMS
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Loan Repayment Service for MSME Lending. Manage schedules, allocate payments, and track outstanding positions dynamically.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
