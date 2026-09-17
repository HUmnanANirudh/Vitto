import { db } from "@/db/drizzle";
import { loans, installments, payments, paymentAllocations } from "@/db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { InstallmentBalance, AllocationEntry } from "@/types";

export const loanRepository = {
  async createLoanWithSchedule(loanData: any, scheduleData: any[]) {
    return db.transaction(async (tx) => {
      const [loan] = await tx.insert(loans).values(loanData).returning();
      await tx.insert(installments).values(scheduleData.map((s) => ({ ...s, loanId: loan.id })));
      return loan;
    });
  },

  async getLoan(loanId: string) {
    const [loan] = await db.select().from(loans).where(eq(loans.id, loanId));
    return loan;
  },

  async getInstallments(loanId: string) {
    return db.select().from(installments).where(eq(installments.loanId, loanId)).orderBy(asc(installments.installmentNumber));
  },

  async getPayments(loanId: string) {
    return db.select().from(payments).where(eq(payments.loanId, loanId)).orderBy(asc(payments.receivedAt));
  },

  async executePaymentTx(
    loanId: string,
    paymentData: { reference: string; amountPaise: number; receivedAt: Date },
    businessLogic: (insts: InstallmentBalance[]) => { allocations: AllocationEntry[]; closeLoan: boolean }
  ) {
    return db.transaction(async (tx) => {
      const insts = await tx.select().from(installments).where(eq(installments.loanId, loanId)).orderBy(asc(installments.installmentNumber)).for("update");
      if (!insts.length) throw new Error("Loan not found");

      const { allocations, closeLoan } = businessLogic(insts as InstallmentBalance[]);
      const [payment] = await tx.insert(payments).values({ loanId, ...paymentData }).returning();

      if (allocations.length > 0) {
        await tx.insert(paymentAllocations).values(allocations.map((a) => ({ ...a, paymentId: payment.id })));
        for (const alloc of allocations) {
          await tx
            .update(installments)
            .set({
              principalPaidPaise: sql`${installments.principalPaidPaise} + ${alloc.principalPaise}`,
              interestPaidPaise: sql`${installments.interestPaidPaise} + ${alloc.interestPaise}`,
            })
            .where(eq(installments.id, alloc.installmentId));
        }
      }

      if (closeLoan) await tx.update(loans).set({ status: "CLOSED" }).where(eq(loans.id, loanId));
      return { payment, allocations };
    });
  },
};
