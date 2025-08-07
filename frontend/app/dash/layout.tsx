// /frontend/app/dash/layout.tsx
import { ReactNode } from 'react';
import { ShieldCheck, Home, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-gray-900 text-white">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-gray-900/50 p-4 backdrop-blur-md sm:flex">
        <div className="mb-8 flex items-center gap-2 text-xl font-bold">
          <ShieldCheck className="h-7 w-7 text-teal-400" />
          <span>Compliance Canary</span>
        </div>
        <nav className="flex flex-col gap-2">
          <Link href="/dash" className="flex items-center gap-3 rounded-lg bg-gray-800 px-3 py-2 text-white transition-all hover:bg-gray-700">
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/dash/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
        <div className="mt-auto">
           <Link href="/api/auth/signout" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800">
            <LogOut className="h-5 w-5" />
            Sign Out
          </Link>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/10 bg-gray-900/50 px-6 backdrop-blur-md">
           <h1 className="text-xl font-semibold">Dashboard Overview</h1>
           {/* We can add user profile button here later */}
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
