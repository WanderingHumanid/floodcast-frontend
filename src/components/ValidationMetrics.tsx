// components/ValidationMetrics.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, BarChart3, LineChart, Check, AlertCircle, Timer, BadgeInfo } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Define types for our metrics
interface TopFeature {
  feature: string;
  importance: number;
  normalized_importance: number;
}

interface ModelInfo {
  usingTidalData: boolean;
  modelName: string;
  tidalDataAvailable: boolean;
}

interface ValidationMetricsData {
  water_level_mae: number | null;
  water_level_rmse: number | null;
  water_level_r2: number | null;
  water_level_mape: number | null;
  top_features: TopFeature[];
  detection_rate: number;
  false_alarm_rate: number;
  lead_time_hours: number;
  confidence_level: number;
  last_updated: string;
  modelInfo?: ModelInfo;
}

export default function ValidationMetrics() {
  const [metrics, setMetrics] = useState<ValidationMetricsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://127.0.0.1:5001/api/metrics');
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError('Failed to load validation metrics. Please ensure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full p-8">
      <Loader2 className="h-8 w-8 animate-spin mr-3" />
      <p>Loading model metrics...</p>
    </div>
  );

  if (error) return (
    <Alert className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">Model Validation Metrics</h1>
      <p className="text-gray-500">
        These metrics help assess the accuracy and reliability of the flood prediction model.
        Last updated: {metrics?.last_updated}
      </p>

      {/* Display model info banner if available */}
      {metrics?.modelInfo && (
        <Alert className={metrics.modelInfo.usingTidalData ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"}>
          <BadgeInfo className="h-4 w-4" />
          <AlertDescription className="flex items-center">
            <span className="font-medium">
              Current model: {metrics.modelInfo.modelName} 
              {metrics.modelInfo.tidalDataAvailable && !metrics.modelInfo.usingTidalData && 
                " (Tidal data available but not currently used)"}
            </span>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Level Prediction Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Water Level Prediction Accuracy
            </CardTitle>
            <CardDescription>
              These metrics evaluate how accurately the model predicts water levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Mean Absolute Error (MAE)</p>
                <p className="text-2xl font-bold">
                  {metrics?.water_level_mae ? metrics.water_level_mae.toFixed(2) : 'N/A'} cm
                </p>
                <p className="text-xs text-gray-500">Average prediction error</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Root Mean Square Error</p>
                <p className="text-2xl font-bold">
                  {metrics?.water_level_rmse ? metrics.water_level_rmse.toFixed(2) : 'N/A'} cm
                </p>
                <p className="text-xs text-gray-500">Error magnitude</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">R² Score</p>
                <p className="text-2xl font-bold">
                  {metrics?.water_level_r2 ? metrics.water_level_r2.toFixed(2) : 'N/A'}
                </p>
                <p className="text-xs text-gray-500">Accuracy score (0-1)</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Mean Absolute % Error</p>
                <p className="text-2xl font-bold">
                  {metrics?.water_level_mape ? metrics.water_level_mape.toFixed(2) : 'N/A'}%
                </p>
                <p className="text-xs text-gray-500">Percentage error</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flood Prediction Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Check className="mr-2 h-5 w-5" />
              Flood Event Detection Performance
            </CardTitle>
            <CardDescription>
              How well the model detects and warns about flood events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Detection Rate</p>
                <p className="text-2xl font-bold">{metrics?.detection_rate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Floods correctly predicted</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">False Alarm Rate</p>
                <p className="text-2xl font-bold">{metrics?.false_alarm_rate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Incorrect flood warnings</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Lead Time</p>
                <p className="text-2xl font-bold">{metrics?.lead_time_hours.toFixed(1)} hours</p>
                <p className="text-xs text-gray-500">Warning time before flood</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Confidence Score</p>
                <p className="text-2xl font-bold">{metrics && (metrics.confidence_level * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-500">Prediction reliability</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Importance */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Top Predictive Factors
            </CardTitle>
            <CardDescription>
              The most influential factors in determining flood risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={metrics?.top_features.slice(0, 10).map(feature => ({
                  name: feature.feature,
                  value: feature.normalized_importance
                }))}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="name" width={90} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Importance']} 
                  contentStyle={{backgroundColor: '#fafafa', border: '1px solid #e0e0e0'}}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {metrics?.top_features.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.feature.includes('tide') ? '#0284c7' :  // Blue for tidal factors
                      entry.feature.includes('rain') ? '#4ade80' :  // Green for rain factors
                      entry.feature.includes('moon') ? '#a855f7' :  // Purple for moon factors
                      index < 3 ? '#ef4444' : index < 6 ? '#f97316' : '#3b82f6'} // Default color scheme
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Model improvement with tidal data section */}
      {metrics?.modelInfo?.tidalDataAvailable && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-blue-800">
              <svg 
                className="mr-2 h-5 w-5" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              </svg>
              Tidal Data Integration
            </CardTitle>
            <CardDescription className="text-blue-700">
              Tidal influence analysis for improved flood prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p>
                Tidal data has been integrated into the flood prediction model to account for coastal influences on water levels. 
                Analysis shows that high tide events have a significant correlation with flood events in certain wards.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium text-blue-800">Tide-Water Correlation</p>
                  <p className="text-2xl font-bold">-0.0287</p>
                  <p className="text-xs text-gray-500">Weak negative correlation</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium text-blue-800">Tide-Moon Correlation</p>
                  <p className="text-2xl font-bold">0.1339</p>
                  <p className="text-xs text-gray-500">Weak positive correlation</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium text-blue-800">Current Model R²</p>
                  <p className="text-2xl font-bold">0.7392</p>
                  <p className="text-xs text-gray-500">With tidal data included</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
