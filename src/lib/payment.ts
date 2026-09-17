import { InstallmentBalance, AllocationEntry } from "../types";

//Incoming payment as oldest instalment first, interest before principal.
export function allocatePayment(amountPaise: number, installments: InstallmentBalance[]): AllocationEntry[] {
  if (amountPaise <= 0) throw new Error("Payment amount must be positive");

  const allocations: AllocationEntry[] = [];
  let remaining = amountPaise;

  for (const inst of installments) {
    if (remaining <= 0) break;

    const interestOut = Math.max(0, inst.interestPaise - inst.interestPaidPaise);
    const principalOut = Math.max(0, inst.principalPaise - inst.principalPaidPaise);

    if (interestOut === 0 && principalOut === 0) continue;

    const interestAlloc = Math.min(remaining, interestOut);
    remaining -= interestAlloc;

    const principalAlloc = Math.min(remaining, principalOut);
    remaining -= principalAlloc;

    if (interestAlloc > 0 || principalAlloc > 0) {
      allocations.push({
        installmentId: inst.id,
        interestPaise: interestAlloc,
        principalPaise: principalAlloc,
      });
    }
  }

  return allocations;
}

export function totalOutstanding(installments: InstallmentBalance[]): number {
  return installments.reduce((sum, inst) => {
    return sum + Math.max(0, inst.interestPaise - inst.interestPaidPaise) 
               + Math.max(0, inst.principalPaise - inst.principalPaidPaise);
  }, 0);
}
