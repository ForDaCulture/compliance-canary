// frontend/src/components/Header.tsx
'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('canary_token');
    router.push('/');
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl text-white">Compliance Canary</span>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}