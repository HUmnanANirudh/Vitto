import { ScheduleEntry } from "../types";

// EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1)

export function calculateEMI(principalPaise: number, annualRate: number, tenureMonths: number): number {
  if (tenureMonths <= 0 || principalPaise <= 0 || annualRate < 0) throw new Error("Invalid loan params");
  if (annualRate === 0) return Math.ceil(principalPaise / tenureMonths);

  const r = annualRate / 100 / 12;
  const pow = Math.pow(1 + r, tenureMonths);
  return Math.round((principalPaise * r * pow) / (pow - 1));
}

// Generates the schedule. Final month absorbs rounding drift.

export function generateSchedule(
  principalPaise: number,
  annualRate: number,
  tenureMonths: number,
  startDate: string
): ScheduleEntry[] {
  const emiPaise = calculateEMI(principalPaise, annualRate, tenureMonths);
  const r = annualRate / 100 / 12;

  const schedule: ScheduleEntry[] = [];
  let remaining = principalPaise;

  for (let i = 1; i <= tenureMonths; i++) {
    const dueDate = addMonths(startDate, i);
    const isLast = i === tenureMonths;
    
    const interestPaise = annualRate === 0 ? 0 : Math.round(remaining * r);
    const principalComponent = isLast ? remaining : emiPaise - interestPaise;

    schedule.push({
      installmentNumber: i,
      dueDate,
      principalPaise: principalComponent,
      interestPaise,
      emiPaise: principalComponent + interestPaise,
    });

    remaining -= principalComponent;
  }

  return schedule;
}

//To add months to YYYY-MM-DD, capping to month end.

export function addMonths(dateStr: string, months: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const nextMonth = new Date(Date.UTC(y, m - 1 + months, 1));
  const lastDay = new Date(Date.UTC(nextMonth.getUTCFullYear(), nextMonth.getUTCMonth() + 1, 0)).getUTCDate();
  
  const mm = String(nextMonth.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(Math.min(d, lastDay)).padStart(2, "0");
  return `${nextMonth.getUTCFullYear()}-${mm}-${dd}`;
}
