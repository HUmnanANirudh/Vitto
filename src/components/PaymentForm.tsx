import { PaymentFormProps } from "@/types";

export default function PaymentForm({
  amount,
  setAmount,
  onSubmit,
  isSubmitting,
  isClosed,
  error,
}: PaymentFormProps) {
  return (
    <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm text-gray-900">
      <h2 className="mb-4 text-lg font-semibold">Record Payment</h2>
      <form onSubmit={onSubmit} className="flex items-start gap-4">
        <div className="flex-1">
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Amount (₹)"
            className="w-full rounded border bg-white p-2 text-gray-900 placeholder-gray-400"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || isClosed}
          className="rounded bg-blue-600 px-6 py-2 text-white disabled:bg-gray-400"
        >
          {isSubmitting ? "Processing..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
}
