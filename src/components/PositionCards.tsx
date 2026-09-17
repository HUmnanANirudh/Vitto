export default function PositionCards({ position }: { position: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) {
  return (
    <div className="grid grid-cols-1 divide-y divide-gray-200 border-y border-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div className="px-4 py-6 sm:px-6">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Outstanding Principal</p>
        <p className="mt-2 text-3xl font-light tracking-tight text-black">
          ₹{(position.outstanding / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>
      
      <div className="px-4 py-6 sm:px-6">
        <p className="text-sm font-medium text-red-600 uppercase tracking-wide">Overdue Amount</p>
        <p className="mt-2 text-3xl font-light tracking-tight text-red-600">
          ₹{(position.overdue / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="px-4 py-6 sm:px-6">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Paid</p>
        <p className="mt-2 text-3xl font-light tracking-tight text-black">
          ₹{(position.totalPaid / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
