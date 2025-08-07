// frontend/src/components/RepoCard.tsx
import { ShieldCheck, ShieldAlert, GitBranch, PowerOff } from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  active: boolean;
  vulnerabilityCount: number;
}

interface RepoCardProps {
  repo: Repo;
}

export default function RepoCard({ repo }: RepoCardProps) {
  const isVulnerable = repo.vulnerabilityCount > 0;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 flex flex-col justify-between hover:border-violet-500 transition-all duration-300 shadow-lg">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <GitBranch className="w-5 h-5 mr-2 text-gray-400" />
            {repo.name}
          </h3>
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${repo.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {repo.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          {isVulnerable ? (
            <div className="flex items-center text-red-400">
              <ShieldAlert className="w-5 h-5 mr-1" />
              <span>{repo.vulnerabilityCount} vulnerabilities found</span>
            </div>
          ) : (
            <div className="flex items-center text-green-400">
              <ShieldCheck className="w-5 h-5 mr-1" />
              <span>No vulnerabilities</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6">
        <button className="w-full text-center px-4 py-2 font-semibold text-white bg-violet-600 rounded-md hover:bg-violet-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500">
          View Reports
        </button>
      </div>
    </div>
  );
}