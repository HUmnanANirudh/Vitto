export default function ScheduleTable({
  installments,
}: {
  installments: any[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">Repayment Schedule</h2>
        <p className="text-sm text-gray-500">Track all past and upcoming installments.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-900">#</th>
              <th className="px-6 py-4 font-semibold text-gray-900">Due Date</th>
              <th className="px-6 py-4 text-right font-semibold text-gray-900">Principal</th>
              <th className="px-6 py-4 text-right font-semibold text-gray-900">Interest</th>
              <th className="px-6 py-4 text-right font-semibold text-gray-900">Total Due</th>
              <th className="px-6 py-4 text-right font-semibold text-gray-900">Paid</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {installments.map((inst: any) => {
              const totalDue = inst.principalPaise + inst.interestPaise;
              const totalPaid = inst.principalPaidPaise + inst.interestPaidPaise;
              const isFullyPaid = totalPaid >= totalDue;
              const isOverdue =
                !isFullyPaid &&
                inst.dueDate < new Date().toISOString().split("T")[0];

              return (
                <tr
                  key={inst.id}
                  className={`transition-colors hover:bg-gray-50/80 ${isOverdue ? "bg-red-50/30" : ""}`}
                >
                  <td className="px-6 py-4 text-gray-500">{inst.installmentNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{new Date(inst.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    ₹{(inst.principalPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    ₹{(inst.interestPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    ₹{(totalDue / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-green-600">
                    ₹{(totalPaid / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isFullyPaid ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Paid
                      </span>
                    ) : isOverdue ? (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        Overdue
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
