// components/NavbarAlt.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import '../app/logo-styles.css';

export default function NavbarAlt() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo shield with separate text */}
            <div className="flex items-center">
              <div className="logo-container">
                <Image 
                  src="/floodcast-logo.png" 
                  alt="FloodCast Logo" 
                  width={150}
                  height={150}
                  priority
                />
              </div>
              <span className="logo-text">FloodCast</span>
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
          </div>
        </div>
      </div>
    </nav>
  );
}
