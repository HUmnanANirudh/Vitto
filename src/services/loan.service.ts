import { loanRepository } from "@/repositories/loan.repository";
import { generateSchedule } from "@/lib/emi";
import { allocatePayment, totalOutstanding } from "@/lib/payment";
import {
  InstallmentBalance,
  CreateLoanSchema,
  CreatePaymentSchema,
} from "@/types";

export const loanService = {
  async createLoan(data: any) {
    const { principalPaise, annualRate, tenureMonths, startDate } =
      CreateLoanSchema.parse(data);
    const schedule = generateSchedule(
      principalPaise,
      annualRate,
      tenureMonths,
      startDate,
    );

    return loanRepository.createLoanWithSchedule(
      {
        userId: data.userId,
        principalPaise,
        annualRate: annualRate.toFixed(2),
        tenureMonths,
        startDate,
      },
      schedule,
    );
  },

  async getLoans() {
    return loanRepository.getAllLoans();
  },

  async getLoanDetails(loanId: string) {
    const [loan, insts, pmts] = await Promise.all([
      loanRepository.getLoan(loanId),
      loanRepository.getInstallments(loanId),
      loanRepository.getPayments(loanId),
    ]);
    if (!loan) return null;

    const totalPaid = pmts.reduce(
      (sum: number, p: any) => sum + p.amountPaise,
      0,
    );
    const outstanding = totalOutstanding(insts as InstallmentBalance[]);

    const today = new Date().toISOString().split("T")[0];
    const overdue = insts
      .filter((i: any) => i.dueDate < today)
      .reduce(
        (sum: number, i: any) =>
          sum +
          Math.max(0, i.principalPaise - i.principalPaidPaise) +
          Math.max(0, i.interestPaise - i.interestPaidPaise),
        0,
      );

    const nextInstalment = insts.find(
      (i: any) =>
        i.principalPaise + i.interestPaise >
        i.principalPaidPaise + i.interestPaidPaise,
    );

    const nextDueDate = nextInstalment ? nextInstalment.dueDate : null;
    const nextDueAmount = nextInstalment
      ? nextInstalment.principalPaise -
        nextInstalment.principalPaidPaise +
        (nextInstalment.interestPaise - nextInstalment.interestPaidPaise)
      : 0;

    return {
      loan,
      position: { totalPaid, outstanding, overdue, nextDueDate, nextDueAmount },
      installments: insts,
      payments: pmts,
    };
  },

  async processPayment(loanId: string, data: any) {
    const parsed = CreatePaymentSchema.parse(data);

    return loanRepository.executePaymentTx(
      loanId,
      {
        reference: parsed.reference,
        amountPaise: parsed.amountPaise,
        receivedAt: new Date(parsed.receivedAt),
      },
      (insts: InstallmentBalance[]) => {
        const outstanding = totalOutstanding(insts);
        if (parsed.amountPaise > outstanding)
          throw new Error("Payment exceeds total outstanding amount");
        return {
          allocations: allocatePayment(parsed.amountPaise, insts),
          closeLoan: parsed.amountPaise === outstanding,
        };
      },
    );
  },
};
