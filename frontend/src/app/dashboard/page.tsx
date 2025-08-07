// frontend/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import RepoCard from '@/components/RepoCard';
import { getRepositories } from '@/lib/api'; // We'll need to implement this
import { useRouter } from 'next/navigation';

// Mock data until the API is fully implemented
const mockRepos = [
  { id: 1, name: 'compliance-canary-frontend', clone_url: '...', active: true, lastScan: 'Clean', vulnerabilityCount: 0 },
  { id: 2, name: 'legacy-monolith', clone_url: '...', active: true, lastScan: 'Vulnerable', vulnerabilityCount: 3 },
  { id: 3, name: 'api-gateway', clone_url: '...', active: false, lastScan: 'N/A', vulnerabilityCount: 0 },
];

export default function DashboardPage() {
  const [repos, setRepos] = useState(mockRepos); // Using mock data for now
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token, redirect if not found
    const token = localStorage.getItem('canary_token');
    if (!token) {
      router.push('/');
      return;
    }

    // In a real scenario, you would fetch data like this:
    /*
    const fetchRepos = async () => {
      try {
        const data = await getRepositories();
        setRepos(data);
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
        router.push('/'); // Redirect on auth error
      } finally {
        setIsLoading(false);
      }
    };
    fetchRepos();
    */
   setIsLoading(false); // For mock data
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">Loading dashboard...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Your Repositories</h1>
          <p className="text-gray-400">Overview of your monitored repositories and their latest scan status.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </main>
    </div>
  );
}