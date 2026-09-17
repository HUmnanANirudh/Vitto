import { NextResponse } from "next/server";
import { loanService } from "@/services/loan.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await loanService.createLoan(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
