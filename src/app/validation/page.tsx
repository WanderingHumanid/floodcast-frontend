'use client';

import { useEffect, useState } from 'react';
import { 
  MetricsResponse, 
  MetricDetails, 
  getModelMetrics 
} from '@/services/metrics';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  Info, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BarChart4,
  HelpCircle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function ValidationPage() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const data = await getModelMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load validation metrics. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  // Helper function to format metrics
  const formatMetric = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return value.toFixed(4);
  };

  // Format percentage metrics
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
          <p className="mt-4 text-lg">Loading validation metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold text-red-700 mt-4">Error Loading Metrics</h2>
              <p className="mt-2 text-red-600">{error}</p>
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create data for feature importance chart
  const featureImportanceData = metrics?.feature_importance.map(item => ({
    feature: item.feature.replace(/_/g, ' '),
    importance: item.importance
  })) || [];

  // Create data for forecast horizons chart
  const forecastHorizonsData = Object.keys(metrics?.forecast_horizons || {}).map(horizon => ({
    horizon: horizon,
    rmse: metrics?.forecast_horizons[horizon].rmse || 0,
    r2: metrics?.forecast_horizons[horizon].r2 || 0,
    mape: metrics?.forecast_horizons[horizon].mape || 0
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent">Model Validation Results</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Comprehensive assessment of the FloodCast model's performance metrics and validation results.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-50 to-sky-50 p-1 rounded-xl">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">Forecast Horizons</TabsTrigger>
          <TabsTrigger value="extreme" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">Extreme Events</TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">Feature Importance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2" />
                  Enhanced Model Performance
                </CardTitle>
                <CardDescription>
                  Key metrics for the enhanced predictive model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="w-[100px]">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics?.enhanced_model && Object.entries(metrics.enhanced_model).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium">
                          {key === 'rmse' ? 'RMSE' : 
                           key === 'mae' ? 'MAE' : 
                           key === 'r2' ? 'R²' : 
                           key === 'mape' ? 'MAPE' : 
                           key === 'lead_time_hours' ? 'Lead Time' : key}
                        </TableCell>
                        <TableCell>
                          {key === 'lead_time_hours' ? `${value} hours` : 
                           key === 'mape' ? formatPercentage(value) :
                           formatMetric(value)}
                        </TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <HelpCircle className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">{MetricDetails[key]?.name || key}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {MetricDetails[key]?.description || 'No description available'}
                                </p>
                                {MetricDetails[key]?.formula && (
                                  <div className="rounded bg-slate-100 p-2 text-xs font-mono">
                                    {MetricDetails[key].formula}
                                  </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  <span className="font-semibold">Interpretation:</span> {MetricDetails[key]?.interpretation || 'No interpretation available'}
                                </p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  High Water Level Performance
                </CardTitle>
                <CardDescription>
                  Model accuracy for high water level events (n={metrics?.high_water_levels.samples || 0} samples)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">R² Score</span>
                      <span className="text-sm font-medium">{formatMetric(metrics?.high_water_levels.r2 || 0)}</span>
                    </div>
                    <div className="bg-blue-100 rounded-full h-2 w-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" 
                        style={{ width: `${(metrics?.high_water_levels.r2 || 0) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">RMSE</span>
                      <span className="text-sm font-medium">{formatMetric(metrics?.high_water_levels.rmse || 0)}</span>
                    </div>
                    <div className="bg-red-100 rounded-full h-2 w-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" 
                        style={{ width: `${100 - Math.min(((metrics?.high_water_levels.rmse || 0) * 20), 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lower RMSE indicates better accuracy
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">MAPE</span>
                      <span className="text-sm font-medium">{formatPercentage(metrics?.high_water_levels.mape || 0)}</span>
                    </div>
                    <div className="bg-amber-100 rounded-full h-2 w-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" 
                        style={{ width: `${100 - Math.min((metrics?.high_water_levels.mape || 0), 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lower MAPE indicates better accuracy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Forecast Horizons Tab */}
        <TabsContent value="forecast" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Forecast Accuracy by Time Horizon</CardTitle>
              <CardDescription>
                Performance across different prediction timeframes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={forecastHorizonsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                    <XAxis dataKey="horizon" stroke="#4b5563" />
                    <YAxis stroke="#4b5563" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="rmse" name="RMSE" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="mape" name="MAPE (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="r2" name="R² Score" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="forecast-details">
                  <AccordionTrigger>View Detailed Metrics</AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time Horizon</TableHead>
                          <TableHead>RMSE</TableHead>
                          <TableHead>R²</TableHead>
                          <TableHead>MAPE</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(metrics?.forecast_horizons || {}).map(([horizon, values]) => (
                          <TableRow key={horizon}>
                            <TableCell className="font-medium">{horizon}</TableCell>
                            <TableCell>{formatMetric(values.rmse)}</TableCell>
                            <TableCell>{formatMetric(values.r2)}</TableCell>
                            <TableCell>{formatPercentage(values.mape)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extreme Events Tab */}
        <TabsContent value="extreme" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <XCircle className="h-5 w-5 mr-2" />
                Extreme Event Detection
              </CardTitle>
              <CardDescription>
                Performance metrics for detecting and predicting rare flood events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Correct Predictions</h3>
                      <p className="text-sm text-gray-500">Detection accuracy</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {formatPercentage(metrics?.extreme_events.correct_predictions)}
                    </Badge>
                  </div>
                  <div className="bg-green-100 rounded-full h-2 w-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" 
                      style={{ width: `${metrics?.extreme_events.correct_predictions}%` }}
                    ></div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="mt-2 h-8 text-xs">
                        <Info className="h-3 w-3 mr-1" />
                        How it's calculated
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="space-y-2">
                        <h4 className="font-medium">Correct Predictions</h4>
                        <p className="text-sm">
                          {MetricDetails.correct_predictions.description}
                        </p>
                        <div className="rounded bg-slate-100 p-2 text-xs font-mono">
                          {MetricDetails.correct_predictions.formula}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">False Alarms</h3>
                      <p className="text-sm text-gray-500">False positive rate</p>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {formatPercentage(metrics?.extreme_events.false_alarms)}
                    </Badge>
                  </div>
                  <div className="bg-red-100 rounded-full h-2 w-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full" 
                      style={{ width: `${100 - (metrics?.extreme_events.false_alarms || 0)}%` }}
                    ></div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="mt-2 h-8 text-xs">
                        <Info className="h-3 w-3 mr-1" />
                        How it's calculated
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="space-y-2">
                        <h4 className="font-medium">False Alarms</h4>
                        <p className="text-sm">
                          {MetricDetails.false_alarms.description}
                        </p>
                        <div className="rounded bg-slate-100 p-2 text-xs font-mono">
                          {MetricDetails.false_alarms.formula}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Lead Time Accuracy</h3>
                      <p className="text-sm text-gray-500">Early warning capability</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {formatPercentage(metrics?.extreme_events.lead_time_accuracy)}
                    </Badge>
                  </div>
                  <div className="bg-blue-100 rounded-full h-2 w-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-sky-500 rounded-full" 
                      style={{ width: `${metrics?.extreme_events.lead_time_accuracy}%` }}
                    ></div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="mt-2 h-8 text-xs">
                        <Info className="h-3 w-3 mr-1" />
                        How it's calculated
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="space-y-2">
                        <h4 className="font-medium">Lead Time Accuracy</h4>
                        <p className="text-sm">
                          {MetricDetails.lead_time_accuracy.description}
                        </p>
                        <div className="rounded bg-slate-100 p-2 text-xs font-mono">
                          {MetricDetails.lead_time_accuracy.formula}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-lg border border-blue-100 shadow-sm">
                <h3 className="text-lg font-semibold flex items-center text-blue-700">
                  <Clock className="h-6 w-6 mr-2 text-blue-600" />
                  <span>Early Warning Capability</span>
                </h3>
                <p className="mt-3 text-sm text-blue-800">
                  The model can predict extreme flood events with <span className="font-semibold">{formatPercentage(metrics?.extreme_events.lead_time_accuracy)}</span> accuracy 
                  at a lead time of <span className="font-semibold">{metrics?.enhanced_model.lead_time_hours} hours</span>. This provides critical time for evacuation 
                  and emergency response planning.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Importance Tab */}
        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Importance Analysis</CardTitle>
              <CardDescription>
                Relative influence of different factors on flood prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={featureImportanceData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                    <XAxis type="number" stroke="#4b5563" />
                    <YAxis dataKey="feature" type="category" width={150} stroke="#4b5563" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar 
                      dataKey="importance" 
                      name="Importance Score"
                      radius={[0, 4, 4, 0]}
                      fill="url(#colorGradient)" 
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-blue-500 text-[0.625rem] font-medium text-blue-700 mr-2">1</span>
                    <p className="text-sm">
                      <span className="font-semibold">Previous water levels</span> are the strongest predictors, 
                      highlighting the importance of historical data in forecasting.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-blue-500 text-[0.625rem] font-medium text-blue-700 mr-2">2</span>
                    <p className="text-sm">
                      <span className="font-semibold">Tidal factors</span> show significant influence, validating 
                      the inclusion of tidal data in the enhanced model.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-blue-500 text-[0.625rem] font-medium text-blue-700 mr-2">3</span>
                    <p className="text-sm">
                      <span className="font-semibold">Velocity metrics</span> capture rate-of-change dynamics, 
                      which are crucial for early detection of rapid flooding events.
                    </p>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
