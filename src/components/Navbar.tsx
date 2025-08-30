// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, DropletIcon, LineChart } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full dark:bg-blue-900">
                <DropletIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 ml-2">FloodCast</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/validation" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/validation' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                <LineChart className="h-4 w-4 mr-1" />
                <span>Validation</span>
              </div>
            </Link>
            <Link 
              href="/alerts" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/alerts' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800'
              }`}
            >
              ALERT ME!
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
