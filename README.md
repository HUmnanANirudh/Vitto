# Vitto Loan Repayment Service

This is a Next.js application that creates loan repayment schedules, records payments, and calculates the current position of a loan.

<img width="1872" height="880" alt="image" src="https://github.com/user-attachments/assets/5e3c9b30-3e32-4aa2-8f1a-037a3a920ec7" />


## Setup Instructions

Follow these steps to run the application on a clean machine:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create a `.env` file in the root directory. Copy the structure from `.env.example`.

3. **Set up the database:**
   Push the schema to your PostgreSQL database:
   ```bash
   npm run db:push
   ```

4. **Add test data:**
   Create a demo loan and to test the interface:
   ```bash
   npm run db:seed
   ```

5. **Start the application:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser. Sign in using the test account:
   - **Email:** `demo@vitto.com`
   - **Password:** `password123`

## Running Tests

Run the test suite with this single command:
```bash
npm run test
```
This command runs unit tests for the math logic and integration tests against the live database.

## Payment Allocation Rules

When you record a payment, the application allocates the money automatically. The system follows this exact order:

1. **Oldest unpaid instalment first.**
2. **Interest before principal** within that specific instalment.

### Cases Handled

*   **Underpayment:** The system pays the interest first. If any money remains, it pays down the principal. The rest of the instalment stays pending.
*   **Overpayment:** The system settles the current instalment completely. It applies any leftover money to the next pending instalments in order. The API rejects payments that exceed the total outstanding balance of the loan. 
*   **Late payment:** The waterfall logic naturally handles late payments by settling the oldest overdue instalments first. The system tracks the overdue amount but does not charge penalty interest.
*   **Duplicate submission:** The system rejects exact duplicate payments. The database enforces a unique reference string for every payment.
*   **Invalid input:** The system rejects negative amounts, zero-month tenures, and unknown loan IDs before they touch the database.

## Technology Stack

*   **Framework:** Next.js (React)
*   **Database:** PostgreSQL (Neon Serverless)
*   **Data Access:** Drizzle ORM
*   **Authentication:** Firebase Auth
