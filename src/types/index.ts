export interface ScheduleEntry {
  installmentNumber: number;
  dueDate: string;
  principalPaise: number;
  interestPaise: number;
  emiPaise: number;
}

export interface InstallmentBalance {
  id: string;
  installmentNumber: number;
  principalPaise: number;
  interestPaise: number;
  principalPaidPaise: number;
  interestPaidPaise: number;
}

export interface AllocationEntry {
  installmentId: string;
  interestPaise: number;
  principalPaise: number;
}
