CREATE TABLE "installments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"loanId" uuid NOT NULL,
	"installmentNumber" integer NOT NULL,
	"dueDate" date NOT NULL,
	"principalPaise" bigint NOT NULL,
	"interestPaise" bigint NOT NULL,
	"principalPaidPaise" bigint DEFAULT 0 NOT NULL,
	"interestPaidPaise" bigint DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "loanInstallmentUnique" UNIQUE("loanId","installmentNumber")
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL,
	"principalPaise" bigint NOT NULL,
	"annualRate" numeric(5,2) NOT NULL,
	"tenureMonths" integer NOT NULL,
	"startDate" date NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paymentAllocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"paymentId" uuid NOT NULL,
	"installmentId" uuid NOT NULL,
	"principalPaise" bigint NOT NULL,
	"interestPaise" bigint NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"loanId" uuid NOT NULL,
	"reference" text NOT NULL UNIQUE,
	"amountPaise" bigint NOT NULL,
	"receivedAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"firebaseUid" text UNIQUE,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "installments" ADD CONSTRAINT "installments_loanId_loans_id_fkey" FOREIGN KEY ("loanId") REFERENCES "loans"("id");--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "paymentAllocations" ADD CONSTRAINT "paymentAllocations_paymentId_payments_id_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id");--> statement-breakpoint
ALTER TABLE "paymentAllocations" ADD CONSTRAINT "paymentAllocations_installmentId_installments_id_fkey" FOREIGN KEY ("installmentId") REFERENCES "installments"("id");--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_loanId_loans_id_fkey" FOREIGN KEY ("loanId") REFERENCES "loans"("id");