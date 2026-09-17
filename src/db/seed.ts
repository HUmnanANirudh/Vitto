import { config } from "dotenv";
config({ path: ".env" });

import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { users, loans, installments, payments, paymentAllocations } from "./schema";
import { generateSchedule, calculateEMI } from "../lib/emi";
import { eq } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle({ client: pool });

async function seed() {
  console.log("Cleaning up existing loans...\n");
  
  // Clear all loan-related data
  await db.delete(paymentAllocations);
  await db.delete(payments);
  await db.delete(installments);
  await db.delete(loans);

  console.log("Seeding database...\n");

  const [user] = await db
    .insert(users)
    .values({
      email: "demo@vitto.com",
      name: "Demo User",
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { name: "Demo User" }
    })
    .returning();

  console.log(`User: ${user.name} <${user.email}>`);
  console.log(`ID: ${user.id}\n`);

  // reference loan
  const principalPaise = 200_000 * 100;
  const annualRate = 18.0;
  const tenureMonths = 24;
  const startDate = "2026-01-15";

  const [loan] = await db
    .insert(loans)
    .values({
      userId: user.id,
      principalPaise,
      annualRate: annualRate.toFixed(2),
      tenureMonths,
      startDate,
      status: "ACTIVE",
    })
    .returning();

  console.log(
    `Loan: ₹${(principalPaise / 100).toLocaleString("en-IN")} @ ${annualRate}% for ${tenureMonths} months`
  );
  console.log(`   ID: ${loan.id}`);
  console.log(`   Start: ${startDate}\n`);

  // generate repayment schedule
  const schedule = generateSchedule(
    principalPaise,
    annualRate,
    tenureMonths,
    startDate
  );

  await db.insert(installments).values(
    schedule.map((entry) => ({
      loanId: loan.id,
      installmentNumber: entry.installmentNumber,
      dueDate: entry.dueDate,
      principalPaise: entry.principalPaise,
      interestPaise: entry.interestPaise,
    }))
  );

  // summary
  const emiPaise = calculateEMI(principalPaise, annualRate, tenureMonths);
  const totalPrincipal = schedule.reduce((s, e) => s + e.principalPaise, 0);
  const totalInterest = schedule.reduce((s, e) => s + e.interestPaise, 0);

  console.log(`Schedule: ${schedule.length} instalments generated`);
  console.log(
    `   EMI: ₹${(emiPaise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
  );
  console.log(`   First due: ${schedule[0].dueDate}`);
  console.log(`   Last due:  ${schedule[schedule.length - 1].dueDate}`);
  console.log(
    `   Total principal: ₹${(totalPrincipal / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
  );
  console.log(
    `   Total interest:  ₹${(totalInterest / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
  );
  console.log(
    `   Principal match: ${totalPrincipal === principalPaise ? "exact" : "MISMATCH"}`
  );

  console.log("\n Seed complete!");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .then(() => process.exit(0));
