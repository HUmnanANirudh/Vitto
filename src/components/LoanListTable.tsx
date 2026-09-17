import Link from "next/link";

export default function LoanListTable({ loans }: { loans: any[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-900">Loan ID</th>
              <th className="px-6 py-4 font-semibold text-gray-900">Principal</th>
              <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-right font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loans.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg className="mb-4 h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium">No loans found</p>
                    <p className="text-xs text-gray-400">You do not have any active loans at this time.</p>
                  </div>
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr key={loan.id} className="transition-colors hover:bg-gray-50/80">
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{loan.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ₹{(loan.principalPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      loan.status === 'ACTIVE' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10' :
                      loan.status === 'CLOSED' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' :
                      'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/${loan.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                      View Schedule
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
