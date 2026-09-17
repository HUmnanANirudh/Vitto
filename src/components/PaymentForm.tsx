
import { PaymentFormProps } from "@/types";

export default function PaymentForm({
  amount,
  setAmount,
  onSubmit,
  isSubmitting,
  isClosed,
}: PaymentFormProps) {
  return (
    <div className="border border-gray-200 bg-white p-6">
      <h2 className="mb-1 text-lg font-bold text-black">Record Payment</h2>
      <p className="mb-6 text-sm text-gray-500">Enter the exact amount received from the borrower.</p>
      
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div>
          <label htmlFor="amount" className="sr-only">Amount (₹)</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              <span className="text-gray-500 text-lg">₹</span>
            </div>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className="block w-full border-0 border-b border-gray-300 bg-transparent py-2 pl-6 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-0 sm:text-lg sm:leading-6"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={isSubmitting || isClosed}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || isClosed}
          className="flex w-full justify-center bg-black px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : isClosed ? (
            "Loan Closed"
          ) : (
            "Submit Payment"
          )}
        </button>
      </form>
    </div>
  );
}
