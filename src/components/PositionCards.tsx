export default function PositionCards({ position }: { position: any }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="text-sm text-gray-500">Outstanding Principal</div>
        <div className="text-2xl font-bold">
          ₹{(position.outstanding / 100).toFixed(2)}
        </div>
      </div>
      <div className="rounded-lg border bg-red-50 p-4 shadow-sm">
        <div className="text-sm text-red-600">Overdue Amount</div>
        <div className="text-2xl font-bold text-red-700">
          ₹{(position.overdue / 100).toFixed(2)}
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="text-sm text-gray-500">Total Paid</div>
        <div className="text-2xl font-bold text-green-600">
          ₹{(position.totalPaid / 100).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
