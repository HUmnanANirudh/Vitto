
import Link from "next/link";

export default function LoanListTable({ loans }: { loans: any[] }) {
  return (
    <div className="h-full overflow-auto border-t border-gray-200">
      <table className="w-full text-left text-sm ">
        <thead className="sticky top-0 bg-white shadow-[0_1px_0_0_#e5e7eb]">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Loan ID</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Principal</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loans.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-12 text-center">
                <p className="text-sm text-gray-500">No active loans.</p>
              </td>
            </tr>
          ) : (
            loans.map((loan) => (
              <tr key={loan.id} className="group transition-colors hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{loan.id}</td>
                <td className="px-4 py-3 font-medium text-black">
                  ₹{(loan.principalPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center text-xs font-medium ${
                    loan.status === 'ACTIVE' ? 'text-blue-600' :
                    loan.status === 'CLOSED' ? 'text-gray-500' :
                    'text-gray-500'
                  }`}>
                    {loan.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/${loan.id}`}
                    className="inline-flex items-center text-sm font-medium text-black transition-colors hover:text-gray-500"
                  >
                    View
                    <svg className="ml-1 h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
