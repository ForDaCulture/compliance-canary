// frontend/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { getUserRepositories } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // You'll need to add this component

// Define a type for our repository data
interface Repository {
  id: number;
  name: string;
  private: boolean;
  url: string;
}

export default function DashboardPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('canary_token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchRepos = async () => {
      try {
        const data = await getUserRepositories();
        setRepos(data);
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
        // Optionally, add a toast notification for the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Select a Repository</h1>
          <p className="text-gray-400">Choose a repository to activate continuous compliance scanning.</p>
        </div>
        
        {isLoading ? (
          <p className="text-gray-300">Loading repositories from GitHub...</p>
        ) : (
          <div className="border border-gray-800 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-gray-800/50 border-gray-800">
                  <TableHead className="w-[400px] text-white">Repository</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-right text-white">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repos.map((repo) => (
                  <TableRow key={repo.id} className="hover:bg-gray-800/50 border-gray-800">
                    <TableCell className="font-medium">{repo.name}</TableCell>
                    <TableCell>{repo.private ? "Private" : "Public"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Activate Scan</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}