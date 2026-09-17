import { NextResponse } from "next/server";
import { loanService } from "@/services/loan.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ loanId: string }> }
) {
  const p = await params;
  const result = await loanService.getLoanDetails(p.loanId);

  if (!result) {
    return NextResponse.json({ error: "Loan not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
