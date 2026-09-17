import { describe, expect, it } from 'vitest';
import { calculateEMI, generateSchedule } from '@/lib/emi';
import { allocatePayment } from '@/lib/payment';
import { InstallmentBalance } from '@/types';

describe('Schedule Generation', () => {
  it('calculates expected EMI correctly (spec case)', () => {
    // 2,00,000 at 18% over 24 months -> ~9986
    const emi = calculateEMI(200_000_00, 18.0, 24);
    // 9984.82 -> Math.round -> 9985, wait, the spec says ~9986. 
    // "Variance of one or two rupees is acceptable."
    expect(Math.abs(emi - 9985_00)).toBeLessThanOrEqual(200); 
  });

  it('generates correct schedule', () => {
    const schedule = generateSchedule(200_000_00, 18.0, 24, '2026-01-15');
    expect(schedule).toHaveLength(24);
    
    // Total principal should exactly equal initial principal
    const totalPrincipal = schedule.reduce((sum, s) => sum + s.principalPaise, 0);
    expect(totalPrincipal).toBe(200_000_00);
    
    // First due date is a month later
    expect(schedule[0].dueDate).toBe('2026-02-15');
  });

  it('rejects invalid inputs', () => {
    expect(() => calculateEMI(200_000_00, 18.0, 0)).toThrow('Invalid loan params');
    expect(() => calculateEMI(-1000, 18.0, 12)).toThrow('Invalid loan params');
  });
});

describe('Payment Allocation', () => {
  const mockInstallments: InstallmentBalance[] = [
    {
      id: 'inst1',
      loanId: 'loan1',
      installmentNumber: 1,
      dueDate: '2026-02-15',
      principalPaise: 5000_00,
      interestPaise: 4986_00,
      principalPaidPaise: 0,
      interestPaidPaise: 0,
    },
    {
      id: 'inst2',
      loanId: 'loan1',
      installmentNumber: 2,
      dueDate: '2026-03-15',
      principalPaise: 5100_00,
      interestPaise: 4886_00,
      principalPaidPaise: 0,
      interestPaidPaise: 0,
    }
  ];

  it('handles underpayment (interest before principal)', () => {
    // Instalment is 9986. Receive 5000.
    const allocations = allocatePayment(5000_00, mockInstallments);
    
    // Should fully pay interest (4986) and leave 14 for principal
    expect(allocations).toHaveLength(1);
    expect(allocations[0].installmentId).toBe('inst1');
    expect(allocations[0].interestPaise).toBe(4986_00);
    expect(allocations[0].principalPaise).toBe(14_00);
  });

  it('handles overpayment (settles current, spills to next)', () => {
    // Instalment is 9986. Receive twice that = 19972.
    const allocations = allocatePayment(19972_00, mockInstallments);
    
    expect(allocations).toHaveLength(2);
    // Settles first entirely
    expect(allocations[0].interestPaise).toBe(4986_00);
    expect(allocations[0].principalPaise).toBe(5000_00);
    // Spills to next
    expect(allocations[1].interestPaise).toBe(4886_00);
    expect(allocations[1].principalPaise).toBe(5100_00);
  });

  it('handles late payment naturally through waterfall logic', () => {
    // A late payment is just treated as the oldest unpaid installment
    const latePayment = allocatePayment(9986_00, mockInstallments);
    expect(latePayment[0].installmentId).toBe('inst1');
    expect(latePayment[0].interestPaise).toBe(4986_00);
    expect(latePayment[0].principalPaise).toBe(5000_00);
  });
});
