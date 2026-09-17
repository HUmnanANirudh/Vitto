import Link from "next/link";

export default function HeroContent() {
  return (
    <div className="relative z-20 container m-auto flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="max-w-3xl text-5xl font-medium tracking-tighter text-foreground md:text-7xl">
        Vitto
      </h1>
      <p className=" max-w-xl text-muted-foreground/80">
        Manage schedules, allocate payments, and track outstanding positions dynamically for MSME Lending.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/login"
          className="group/button shrink-0 border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground h-9 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 text-md group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
        >
          <span>Sign In</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" aria-hidden="true">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Link>
        <Link 
          href="/signup"
          className="group/button shrink-0 border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-blue-600 text-white hover:bg-blue-700 h-9 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 text-md group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
        >
          <span>Get Started</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" aria-hidden="true">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}
