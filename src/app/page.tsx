// app/page.tsx
import FloodMapDashboard from '@/components/FloodMap';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 px-4">Flood Risk Dashboard</h1>
        <div className="h-[calc(100vh-8rem)]">
          <FloodMapDashboard />
        </div>
      </div>
    </main>
  );
}