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
  firebaseUid: text("firebaseUid").unique(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
});

export const loans = pgTable("loans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().references(() => users.id),
  principalPaise: bigint("principalPaise", { mode: "number" }).notNull(),
  annualRate: numeric("annualRate", { precision: 5, scale: 2 }).notNull(),
  tenureMonths: integer("tenureMonths").notNull(),
  startDate: date("startDate", { mode: "string" }).notNull(),
  status: text("status").notNull().default("ACTIVE"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
});

export const installments = pgTable(
  "installments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    loanId: uuid("loanId").notNull().references(() => loans.id),
    installmentNumber: integer("installmentNumber").notNull(),
    dueDate: date("dueDate", { mode: "string" }).notNull(),
    principalPaise: bigint("principalPaise", { mode: "number" }).notNull(),
    interestPaise: bigint("interestPaise", { mode: "number" }).notNull(),
    principalPaidPaise: bigint("principalPaidPaise", { mode: "number" }).notNull().default(0),
    interestPaidPaise: bigint("interestPaidPaise", { mode: "number" }).notNull().default(0),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique("loanInstallmentUnique").on(table.loanId, table.installmentNumber)]
);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  loanId: uuid("loanId").notNull().references(() => loans.id),
  reference: text("reference").notNull().unique(),
  amountPaise: bigint("amountPaise", { mode: "number" }).notNull(),
  receivedAt: timestamp("receivedAt", { withTimezone: true }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
});

export const paymentAllocations = pgTable("paymentAllocations", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentId: uuid("paymentId").notNull().references(() => payments.id),
  installmentId: uuid("installmentId").notNull().references(() => installments.id),
  principalPaise: bigint("principalPaise", { mode: "number" }).notNull(),
  interestPaise: bigint("interestPaise", { mode: "number" }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
});
