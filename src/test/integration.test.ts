import { describe, expect, it, afterAll } from 'vitest';
import { POST as createLoan } from '@/app/api/loans/route';
import { GET as getLoan } from '@/app/api/loans/[loanId]/route';
import { POST as createPayment } from '@/app/api/loans/[loanId]/payments/route';
import { db } from '@/db/drizzle';
import { loans, installments, payments, paymentAllocations } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

//to create mock Requests
function mockRequest(method: string, body?: unknown, token: string | null = "valid-token") {
  const headers = new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return new Request('http://localhost:3000', {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe('API Route Handlers Integration', () => {
  let testLoanId: string;

  afterAll(async () => {
    if (testLoanId) {
      const pmts = await db.select({ id: payments.id }).from(payments).where(eq(payments.loanId, testLoanId));
      if (pmts.length > 0) {
        await db.delete(paymentAllocations).where(inArray(paymentAllocations.paymentId, pmts.map(p => p.id)));
        await db.delete(payments).where(eq(payments.loanId, testLoanId));
      }
      await db.delete(installments).where(eq(installments.loanId, testLoanId));
      await db.delete(loans).where(eq(loans.id, testLoanId));
    }
  });

  it('rejects unauthenticated requests', async () => {
    const req = mockRequest('POST', { principalPaise: 100000 }, null);
    const res = await createLoan(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toMatch(/Unauthorized/);
  });

  it('success path: creates a loan', async () => {
    const req = mockRequest('POST', {
      principalPaise: 500_000_00,
      annualRate: 15.0,
      tenureMonths: 12,
      startDate: '2026-05-01'
    });
    
    const res = await createLoan(req);
    expect(res.status).toBe(201);
    
    const data = await res.json();
    expect(data.id).toBeDefined();
    
    testLoanId = data.id;
  });

  it('success path: retrieves loan and processes payment', async () => {
    //loan
    const getReq = mockRequest('GET');
    const getRes = await getLoan(getReq, { params: Promise.resolve({ loanId: testLoanId }) });
    expect(getRes.status).toBe(200);
    const loanData = await getRes.json();
    
    //installment total due
    const firstInstalment = loanData.installments[0];
    const emi = firstInstalment.principalPaise + firstInstalment.interestPaise;
    
    //make a payment
    const paymentReq = mockRequest('POST', {
      amountPaise: emi,
      receivedAt: '2026-06-01T10:00:00Z',
      reference: `ref-${Date.now()}`
    });
    const paymentRes = await createPayment(paymentReq, { params: Promise.resolve({ loanId: testLoanId }) });
    expect(paymentRes.status).toBe(201);
    const paymentData = await paymentRes.json();
    
    expect(paymentData.allocations.length).toBeGreaterThan(0);
  });

  it('failure path: duplicate payment reference', async () => {
    const ref = `dup-ref-${Date.now()}`;
    
    const req1 = mockRequest('POST', {
      amountPaise: 1000,
      receivedAt: '2026-06-02T10:00:00Z',
      reference: ref
    });
    const res1 = await createPayment(req1, { params: Promise.resolve({ loanId: testLoanId }) });
    expect(res1.status).toBe(201);
    
    const req2 = mockRequest('POST', {
      amountPaise: 1000,
      receivedAt: '2026-06-02T10:00:00Z',
      reference: ref
    });
    const res2 = await createPayment(req2, { params: Promise.resolve({ loanId: testLoanId }) });
    expect(res2.status).toBe(400);
  });
});
