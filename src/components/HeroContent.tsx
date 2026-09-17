import Link from "next/link";

export default function HeroContent() {
  return (
    <div className="relative z-20 container mx-auto flex flex-col items-center justify-center text-center px-4">
      <div className="relative max-w-4xl flex flex-col items-center">
        <h1 className="text-5xl font-light tracking-tight text-black dark:text-white md:text-7xl lg:text-8xl">
          Loan Repayment <br className="hidden sm:block" />
          <span className="font-medium">Infrastructure.</span>
        </h1>
      </div>

      <p className="mt-4 max-w-2xl mx-auto text-base font-normal text-gray-500 dark:text-gray-400 md:text-lg leading-relaxed">
        Secure, scalable loan repayment software for MSME lending operations. Track schedules, calculate interest, and manage collections with perfect precision.
      </p>

      <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
        <Link 
          href="/signup" 
          className="group inline-flex items-center justify-center border border-transparent bg-black dark:bg-white px-8 py-4 text-sm font-medium uppercase tracking-widest text-white dark:text-black transition-colors active:scale-[0.98]"
        >
          Get Started
        </Link>
        <Link 
          href="/login" 
          className="group inline-flex items-center justify-center border border-black dark:border-white bg-transparent px-8 py-4 text-sm font-medium uppercase tracking-widest text-black dark:text-white transition-colors active:scale-[0.98]"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
