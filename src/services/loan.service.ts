import { z } from "zod";
import { loanRepository } from "@/repositories/loan.repository";
import { generateSchedule } from "@/lib/emi";
import { allocatePayment, totalOutstanding } from "@/lib/payment";
import { InstallmentBalance } from "@/types";

const CreateLoanSchema = z.object({
  principalPaise: z.number().int().min(50000_00).max(1000000_00),
  annualRate: z.number().min(0).max(100),
  tenureMonths: z.number().int().min(3).max(36),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
  userId: z.string().uuid(),
});

const CreatePaymentSchema = z.object({
  reference: z.string().min(1),
  amountPaise: z.number().int().positive(),
  receivedAt: z.string().datetime(),
});

export const loanService = {
  async createLoan(data: any) {
    const { userId, principalPaise, annualRate, tenureMonths, startDate } = CreateLoanSchema.parse(data);
    const schedule = generateSchedule(principalPaise, annualRate, tenureMonths, startDate);

    return loanRepository.createLoanWithSchedule(
      { userId, principalPaise, annualRate: annualRate.toFixed(2), tenureMonths, startDate },
      schedule
    );
  },

  async getLoanDetails(loanId: string) {
    const [loan, insts, pmts] = await Promise.all([
      loanRepository.getLoan(loanId),
      loanRepository.getInstallments(loanId),
      loanRepository.getPayments(loanId)
    ]);
    if (!loan) return null;

    const today = new Date().toISOString().split("T")[0];
    return {
      loan,
      position: {
        totalPaid: pmts.reduce((sum: number, p: any) => sum + p.amountPaise, 0),
        outstanding: totalOutstanding(insts as InstallmentBalance[]),
        overdue: insts.filter((i: any) => i.dueDate < today).reduce(
          (sum: number, i: any) => sum + Math.max(0, i.principalPaise - i.principalPaidPaise) + Math.max(0, i.interestPaise - i.interestPaidPaise), 0
        )
      },
      installments: insts,
      payments: pmts,
    };
  },

  async processPayment(loanId: string, data: any) {
    const parsed = CreatePaymentSchema.parse(data);

    return loanRepository.executePaymentTx(
      loanId,
      { reference: parsed.reference, amountPaise: parsed.amountPaise, receivedAt: new Date(parsed.receivedAt) },
      (insts: InstallmentBalance[]) => {
        const outstanding = totalOutstanding(insts);
        if (parsed.amountPaise > outstanding) throw new Error("Payment exceeds total outstanding amount");
        return {
          allocations: allocatePayment(parsed.amountPaise, insts),
          closeLoan: parsed.amountPaise === outstanding,
        };
      }
    );
  },
};
