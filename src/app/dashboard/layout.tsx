import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] lg:h-[100dvh] w-full flex-col lg:overflow-hidden bg-white font-sans text-gray-900 antialiased">
      <Navbar />
      <div className="flex flex-1 flex-col lg:overflow-hidden">
        {children}
      </div>
    </div>
  );
}
