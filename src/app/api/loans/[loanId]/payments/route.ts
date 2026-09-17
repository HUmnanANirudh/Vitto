import { NextResponse } from "next/server";
import { loanService } from "@/services/loan.service";
import { getAuthUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ loanId: string }> },
) {
  try {
    await getAuthUser(req);
    const p = await params;
    const body = await req.json();
    const result = await loanService.processPayment(p.loanId, body);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.message.startsWith("Unauthorized"))
      return NextResponse.json({ error: error.message }, { status: 401 });
    if (error.code === "23505")
      return NextResponse.json(
        { error: "Duplicate payment reference" },
        { status: 409 },
      );
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
