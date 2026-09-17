/**
 * Seed script — creates demo data for development.
 *
 * Run: npx tsx src/db/seed.ts
 *
 * Creates:
 *   - 1 demo user (demo@vitto.com)
 *   - 1 reference loan: ₹2,00,000 at 18% p.a. over 24 months
 *   - Full repayment schedule (24 instalments)
 */
import { config } from "dotenv";
config({ path: ".env" });

import { drizzle } from "drizzle-orm/neon-http";
import { users, loans, installments } from "./schema";
import { generateSchedule, calculateEMI } from "../lib/emi";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ── 1. Create demo user ──
  const [user] = await db
    .insert(users)
    .values({
      email: "demo@vitto.com",
      name: "Demo User",
    })
    .returning();

  console.log(`✅ User: ${user.name} <${user.email}>`);
  console.log(`   ID: ${user.id}\n`);

  // ── 2. Create reference loan ──
  const principalPaise = 200_000 * 100; // ₹2,00,000
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
    `✅ Loan: ₹${(principalPaise / 100).toLocaleString("en-IN")} @ ${annualRate}% for ${tenureMonths} months`
  );
  console.log(`   ID: ${loan.id}`);
  console.log(`   Start: ${startDate}\n`);

  // ── 3. Generate repayment schedule ──
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

  // ── 4. Print summary ──
  const emiPaise = calculateEMI(principalPaise, annualRate, tenureMonths);
  const totalPrincipal = schedule.reduce((s, e) => s + e.principalPaise, 0);
  const totalInterest = schedule.reduce((s, e) => s + e.interestPaise, 0);

  console.log(`✅ Schedule: ${schedule.length} instalments generated`);
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
    `   Principal match: ${totalPrincipal === principalPaise ? "✅ exact" : "❌ MISMATCH"}`
  );

  console.log("\n🎉 Seed complete!");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .then(() => process.exit(0));
