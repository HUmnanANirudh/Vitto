import { NextResponse } from "next/server";
import { loanService } from "@/services/loan.service";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    const body = await req.json();

    const result = await loanService.createLoan({ ...body, userId: user.id });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.message.startsWith("Unauthorized"))
      return NextResponse.json({ error: error.message }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const loans = await loanService.getLoans();
    return NextResponse.json(loans);
  } catch (error: any) {
    if (error.message.startsWith("Unauthorized"))
      return NextResponse.json({ error: error.message }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
