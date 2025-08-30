'use client';

import { Suspense } from 'react';
import { Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';
import './map-styles.css';

// Load the FloodMap component with client-side rendering only
const FloodMapWithNoSSR = dynamic(
  () => import('@/components/SimpleFloodMap'),
  { ssr: false }
);

export default function MapPage() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 px-4">Flood Risk Map</h1>
        <div className="h-[calc(100vh-8rem)]">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-12 w-12 animate-spin" />
              <p className="ml-4 text-lg">Loading map...</p>
            </div>
          }>
            <FloodMapWithNoSSR />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
