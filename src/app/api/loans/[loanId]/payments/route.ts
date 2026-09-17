import { NextResponse } from "next/server";
import { loanService } from "@/services/loan.service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ loanId: string }> }
) {
  try {
    const p = await params;
    const body = await req.json();
    const result = await loanService.processPayment(p.loanId, body);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.code === "23505") { // Postgres unique violation
      return NextResponse.json({ error: "Duplicate payment reference" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
