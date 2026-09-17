export default function ScheduleTable({
  installments,
}: {
  installments: Record<string, unknown>[];
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 shrink-0">
        <h2 className="text-lg font-bold text-black">Repayment Schedule</h2>
      </div>
      <div className="flex-1 overflow-auto border-t border-gray-200">
        <table className="w-full text-left text-sm ">
          <thead className="sticky top-0 bg-white shadow-[0_1px_0_0_#e5e7eb]">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">#</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Due Date</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Principal</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Interest</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">Total Due</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Paid</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {installments.map((inst: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
              const totalDue = inst.principalPaise + inst.interestPaise;
              const totalPaid = inst.principalPaidPaise + inst.interestPaidPaise;
              const isFullyPaid = totalPaid >= totalDue;
              const isOverdue =
                !isFullyPaid &&
                inst.dueDate < new Date().toISOString().split("T")[0];

              return (
                <tr
                  key={inst.id}
                  className={`group transition-colors hover:bg-gray-50 ${isOverdue ? "bg-red-50/20" : ""}`}
                >
                  <td className="px-4 py-3 text-gray-500">{inst.installmentNumber}</td>
                  <td className="px-4 py-3 font-medium text-black">{new Date(inst.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ₹{(inst.principalPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ₹{(inst.interestPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-black">
                    ₹{(totalDue / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">
                    ₹{(totalPaid / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isFullyPaid ? (
                      <span className="text-xs font-medium text-green-600">Paid</span>
                    ) : isOverdue ? (
                      <span className="text-xs font-medium text-red-600">Overdue</span>
                    ) : (
                      <span className="text-xs font-medium text-gray-500">Pending</span>
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
