import Link from "next/link";

export default function LoanListTable({ loans }: { loans: any[] }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 font-medium text-gray-900">Loan ID</th>
            <th className="p-4 font-medium text-gray-900">Principal</th>
            <th className="p-4 font-medium text-gray-900">Status</th>
            <th className="p-4 font-medium text-gray-900">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {loans.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No loans found.
              </td>
            </tr>
          ) : (
            loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-xs">{loan.id}</td>
                <td className="p-4">₹{(loan.principalPaise / 100).toFixed(2)}</td>
                <td className="p-4">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {loan.status}
                  </span>
                </td>
                <td className="p-4">
                  <Link href={`/dashboard/${loan.id}`} className="text-blue-600 hover:underline">
                    View Schedule
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
