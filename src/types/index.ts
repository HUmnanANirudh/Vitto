import { z } from "zod";

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

export const CreateLoanSchema = z.object({
  principalPaise: z.number().int().min(50000_00).max(1000000_00),
  annualRate: z.number().min(0).max(100),
  tenureMonths: z.number().int().min(3).max(36),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
});

export type CreateLoanInput = z.infer<typeof CreateLoanSchema>;

export const CreatePaymentSchema = z.object({
  reference: z.string().min(1),
  amountPaise: z.number().int().positive(),
  receivedAt: z.string().datetime(),
});

export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;

export const LoginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export interface AuthFormProps {
  title: string;
  buttonText: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    password?: string;
  };
  name?: string;
  setName?: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
  isSubmitting?: boolean;
  altText: string;
  altLinkText: string;
  altLinkHref: string;
}

export interface PaymentFormProps {
  amount: string;
  setAmount: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isClosed: boolean;
  error: string;
}
