'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";
import { API_ENDPOINTS } from '@/config/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Test connection to API
const TestAPIConnection = () => {
  const [status, setStatus] = useState<string>('Checking API connection...');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing connection to:', API_ENDPOINTS.forecast);
        const response = await fetch(API_ENDPOINTS.forecast);
        
        if (response.ok) {
          const data = await response.json();
          setStatus(`API connected successfully: ${response.status}`);
          setApiResponse(data);
          console.log('API response:', data);
          
          // Check if the response has GeoJSON
          if (data.geoJson) {
            try {
              const parsedGeoJson = JSON.parse(data.geoJson);
              console.log('GeoJSON parsed successfully:', parsedGeoJson);
              if (parsedGeoJson.features && parsedGeoJson.features.length > 0) {
                console.log(`GeoJSON contains ${parsedGeoJson.features.length} features`);
                console.log('First feature:', parsedGeoJson.features[0]);
              } else {
                console.error('GeoJSON has no features');
              }
            } catch (jsonError) {
              console.error('Failed to parse GeoJSON:', jsonError);
              setError(`Failed to parse GeoJSON: ${jsonError}`);
            }
          } else {
            console.error('Response missing GeoJSON data');
            setError('Response missing GeoJSON data');
          }
        } else {
          setStatus(`API error: ${response.status} ${response.statusText}`);
          setError(`API error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('API connection error:', error);
        setStatus(`Connection error: ${error instanceof Error ? error.message : String(error)}`);
        setError(`Connection error: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    testConnection();
  }, []);
  
  return (
    <div className="bg-blue-50 p-4 m-4 rounded-md">
      <h2 className="text-lg font-bold mb-2">API Connection Test</h2>
      <p>{status}</p>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {apiResponse && (
        <div className="mt-4">
          <p className="font-semibold">Response Summary:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>GeoJSON: {apiResponse.geoJson ? '✅ Present' : '❌ Missing'}</li>
            <li>Peak Probability: {apiResponse.peakFloodProbability?.toFixed(2)}%</li>
            <li>Top Factors: {apiResponse.topFactors?.length || 0} items</li>
            <li>Hourly Forecast: {apiResponse.hourlyForecast?.length || 0} hours</li>
          </ul>
        </div>
      )}
    </div>
  );
};

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
      {/* API Connection Test removed for showcase */}
      {/* <TestAPIConnection /> */}
      {isClient ? (
        <FloodMapDashboardWithNoSSR />
      ) : (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-12 w-12 animate-spin" />
          <p className="ml-4 text-lg">Loading map...</p>
        </div>
      )}
    </>
  );
}
