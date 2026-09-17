import { NextResponse } from "next/server";
import { loanService } from "@/services/loan.service";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ loanId: string }> },
) {
  try {
    await getAuthUser(req);
    const p = await params;
    const result = await loanService.getLoanDetails(p.loanId);

    if (!result) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message.startsWith("Unauthorized"))
      return NextResponse.json({ error: error.message }, { status: 401 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
