'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";

// This dynamically loads the FloodMapDashboard component only on the client side
const FloodMapDashboardWithNoSSR = dynamic(
  () => import('./FloodMapInner'),
  { ssr: false }
);

export default function FloodMapDashboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? (
        <FloodMapDashboardWithNoSSR />
      ) : (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-12 w-12 animate-spin" />
          <p className="ml-4 text-lg">Generating map...</p>
        </div>
      )}
    </>
  );
}
