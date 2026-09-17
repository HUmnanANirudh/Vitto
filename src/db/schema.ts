import {
  pgTable,
  uuid,
  text,
  integer,
  bigint,
  numeric,
  date,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  firebaseUid: text("firebase_uid").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const loans = pgTable("loans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  principalPaise: bigint("principal_paise", { mode: "number" }).notNull(),
  annualRate: numeric("annual_rate", { precision: 5, scale: 2 }).notNull(),
  tenureMonths: integer("tenure_months").notNull(),
  startDate: date("start_date", { mode: "string" }).notNull(),
  status: text("status").notNull().default("ACTIVE"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const installments = pgTable(
  "installments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    loanId: uuid("loan_id").notNull().references(() => loans.id),
    installmentNumber: integer("installment_number").notNull(),
    dueDate: date("due_date", { mode: "string" }).notNull(),
    principalPaise: bigint("principal_paise", { mode: "number" }).notNull(),
    interestPaise: bigint("interest_paise", { mode: "number" }).notNull(),
    principalPaidPaise: bigint("principal_paid_paise", { mode: "number" }).notNull().default(0),
    interestPaidPaise: bigint("interest_paid_paise", { mode: "number" }).notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique("loan_installment_unique").on(table.loanId, table.installmentNumber)]
);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  loanId: uuid("loan_id").notNull().references(() => loans.id),
  reference: text("reference").notNull().unique(),
  amountPaise: bigint("amount_paise", { mode: "number" }).notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const paymentAllocations = pgTable("payment_allocations", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentId: uuid("payment_id").notNull().references(() => payments.id),
  installmentId: uuid("installment_id").notNull().references(() => installments.id),
  principalPaise: bigint("principal_paise", { mode: "number" }).notNull(),
  interestPaise: bigint("interest_paise", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
