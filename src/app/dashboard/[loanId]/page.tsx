import LoanDetailClient from "@/components/LoanDetailClient";

export default async function LoanDetailPage({ params }: { params: Promise<{ loanId: string }> }) {
  const resolvedParams = await params;
  return <LoanDetailClient loanId={resolvedParams.loanId} />;
}
