export default function ScheduleTable({ installments }: { installments: any[] }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4">#</th>
            <th className="p-4">Due Date</th>
            <th className="p-4 text-right">Principal</th>
            <th className="p-4 text-right">Interest</th>
            <th className="p-4 text-right">Total Due</th>
            <th className="p-4 text-right">Paid</th>
            <th className="p-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {installments.map((inst: any) => {
            const totalDue = inst.principalPaise + inst.interestPaise;
            const totalPaid = inst.principalPaidPaise + inst.interestPaidPaise;
            const isFullyPaid = totalPaid >= totalDue;
            const isOverdue = !isFullyPaid && inst.dueDate < new Date().toISOString().split("T")[0];

            return (
              <tr key={inst.id} className={isOverdue ? "bg-red-50/50" : "hover:bg-gray-50"}>
                <td className="p-4">{inst.installmentNumber}</td>
                <td className="p-4">{inst.dueDate}</td>
                <td className="p-4 text-right">₹{(inst.principalPaise / 100).toFixed(2)}</td>
                <td className="p-4 text-right">₹{(inst.interestPaise / 100).toFixed(2)}</td>
                <td className="p-4 text-right font-medium">₹{(totalDue / 100).toFixed(2)}</td>
                <td className="p-4 text-right text-green-600">₹{(totalPaid / 100).toFixed(2)}</td>
                <td className="p-4 text-center">
                  {isFullyPaid ? (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">PAID</span>
                  ) : isOverdue ? (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">OVERDUE</span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">PENDING</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
