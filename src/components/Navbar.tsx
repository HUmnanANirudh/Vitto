import Link from "next/link";
import Avatar from "boring-avatars";
import { useAuth } from "@/hooks/useAuth";

const THEME_COLORS = ["#2563EB", "#111827", "#4F46E5", "#DBEAFE", "#60A5FA"];

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-md">
          <Avatar 
            size={28} 
            name="Vitto" 
            variant="bauhaus" 
            colors={THEME_COLORS} 
          />
          <span className="text-xl font-extrabold tracking-tighter text-gray-900">
            Vitto <span className="text-blue-600 font-medium">LMS</span>
          </span>
        </Link>
        
        {user && (
          <div className="flex items-center">
            <button 
              onClick={signOut} 
              className="group flex h-9 cursor-pointer items-center justify-center gap-2 rounded-none border-none bg-transparent px-4 text-sm font-semibold text-gray-600 transition-colors hover:text-red-600 focus:outline-none active:scale-95"
            >
              <span>Sign out</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 transition-transform group-hover:translate-x-0.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
