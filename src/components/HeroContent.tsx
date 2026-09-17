import Link from "next/link";

export default function HeroContent() {
  return (
    <div className="relative z-20 container mx-auto flex flex-col items-center justify-center  text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">

      <div className="relative max-w-4xl">
        <div className="absolute -inset-1 blur-3xl opacity-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full hidden sm:block"></div>
        <h1 className="relative text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-white md:text-7xl lg:text-8xl drop-shadow-sm">
          Vitto LMS <br className="hidden sm:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Repayment</span> Service.
        </h1>
      </div>

      <p className="mt-4 max-w-2xl mx-auto text-sm font-medium text-gray-500 dark:text-gray-400 md:text-xl leading-relaxed">
        Secure, scalable, and beautifully designed loan repayment software for MSME lending operations. Track schedules, calculate interest, and manage collections with ease.
      </p>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
        <Link 
          href="/signup" 
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl hover:ring-4 hover:ring-gray-900/20 active:scale-95 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:hover:ring-white/20"
        >
          <span className="relative z-10 flex items-center gap-2">
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 -rotate-45 transition-transform group-hover:rotate-0 group-hover:translate-x-0.5">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </span>
        </Link>
        <Link 
          href="/login" 
          className="group inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-95 dark:border-gray-800 dark:bg-black dark:text-white dark:hover:bg-gray-900"
        >
          Login to Dashboard
        </Link>
      </div>
    </div>
  );
}
