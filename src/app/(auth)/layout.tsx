import Gradient from "@/components/Gradient";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Left Side: Brand Gradient WebGL */}
      <Gradient>
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Vitto LMS
        </h2>
        <p className="text-sm text-blue-100/90 font-medium leading-relaxed">
          Secure, scalable, and beautifully designed loan repayment software for
          MSME lending operations.
        </p>
      </Gradient>

      {/* Right Side: Page Content */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-8 bg-gray-50/50">
        {children}
      </div>
    </div>
  );
}
