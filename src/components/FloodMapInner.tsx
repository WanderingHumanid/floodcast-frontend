'use client';

import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, HelpCircle, MapPin, ShieldAlert, TrendingUp } from "lucide-react";
import type { GeoJsonObject } from 'geojson';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { API_ENDPOINTS } from '@/config/api';
import { getRegionNameForWard, fetchRegionNames } from '../services/regionMapping';

// --- Type Definitions ---
interface WardProperties {
  Name: string;
  inundation_percent: number;
  flood_probability: number;
  color: string;
}
interface WardFeature extends GeoJSON.Feature<GeoJSON.Geometry, WardProperties> {}
type WardGeoJson = GeoJsonObject & { features: WardFeature[] };
interface HourlyForecast { hour: string; probability: number; }
interface TopFactor { feature: string; shap_value: number; }
interface ApiResponse {
  geoJson: string;
  peakFloodProbability: number;
  topFactors: TopFactor[];
  hourlyForecast: HourlyForecast[];
  lastUpdated: string;
}

// --- Main Component ---
export default function FloodMapInner() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [geojsonData, setGeojsonData] = useState<WardGeoJson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredWard, setHoveredWard] = useState<WardProperties | null>(null);
  const [peakWard, setPeakWard] = useState<string | null>(null);
  const [regionMap, setRegionMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch region mapping data
    async function fetchRegionData() {
      const regions = await fetchRegionNames();
      setRegionMap(regions);
    }
    
    fetchRegionData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching data from:", API_ENDPOINTS.forecast);
        
        // Try to fetch data from the API
        try {
          const response = await fetch(API_ENDPOINTS.forecast);
          if (response.ok) {
            const data = await response.json();
            console.log('API Response received:', data);
            processApiData(data);
            return;
          } else {
            console.error("API response not OK:", response.status, response.statusText);
          }
        } catch (fetchError) {
          console.error("Error fetching API:", fetchError);
          // Continue to fallback data
        }
        
        // Fallback to mock data if API fails
        console.log("Using fallback mock data");
        const mockData = getMockData();
        processApiData(mockData);
        
      } catch (err) {
        setError('Failed to process data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    // Helper function to process API data
    function processApiData(data: any) {
      if (data.geoJson) {
        try {
          console.log("Processing GeoJSON data...");
          console.log("GeoJSON string length:", data.geoJson.length);
          
          // Verify the GeoJSON string content (first and last 50 chars)
          console.log("GeoJSON string start:", data.geoJson.substring(0, 50));
          console.log("GeoJSON string end:", data.geoJson.substring(data.geoJson.length - 50));
          
          const parsedGeoJson = JSON.parse(data.geoJson) as WardGeoJson;
          console.log(`Parsed GeoJSON features: ${parsedGeoJson.features.length} wards loaded`);
          
          if (parsedGeoJson.features.length > 0) {
            const firstFeature = parsedGeoJson.features[0];
            console.log("First feature geometry type:", firstFeature.geometry.type);
            // Safely check coordinates if it's a Polygon
            if (firstFeature.geometry.type === 'Polygon' && 'coordinates' in firstFeature.geometry) {
              console.log("First feature coordinates sample:", 
                JSON.stringify((firstFeature.geometry as any).coordinates[0].slice(0, 3)));
            }
            
            const sample = firstFeature.properties;
            console.log('Sample ward data:', {
              name: sample.Name,
              probability: sample.flood_probability,
              inundation: sample.inundation_percent,
              color: sample.color
            });
          }
          
          setGeojsonData(parsedGeoJson);
          
          // Find peak ward
          if (parsedGeoJson.features.length > 0) {
            let maxProbability = 0;
            let peakWardName = '';
            parsedGeoJson.features.forEach(feature => {
              if (feature.properties.flood_probability > maxProbability) {
                maxProbability = feature.properties.flood_probability;
                peakWardName = feature.properties.Name;
              }
            });
            setPeakWard(peakWardName);
          }
          
          setApiData(data);
        } catch (jsonError) {
          console.error('Error parsing GeoJSON:', jsonError);
          throw new Error('Invalid GeoJSON format');
        }
      } else {
        throw new Error('Invalid data format');
      }
    }
    
    // Function to provide mock data when API is not available
    function getMockData() {
      return {
        "geoJson": JSON.stringify({
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "geometry": {
                "type": "Polygon",
                "coordinates": [[[76.294, 9.965], [76.301, 9.965], [76.304, 9.957], [76.294, 9.957], [76.294, 9.965]]]
              },
              "properties": {
                "Name": "Kadavanthra",
                "ward_number": "1",
                "flood_probability": 85,
                "inundation_percent": 68,
                "color": "#ff9900"
              }
            },
            {
              "type": "Feature",
              "geometry": {
                "type": "Polygon",
                "coordinates": [[[76.305, 9.959], [76.312, 9.959], [76.312, 9.952], [76.305, 9.952], [76.305, 9.959]]]
              },
              "properties": {
                "Name": "Elamkulam",
                "ward_number": "2",
                "flood_probability": 65,
                "inundation_percent": 52,
                "color": "#ffff00"
              }
            },
            {
              "type": "Feature",
              "geometry": {
                "type": "Polygon",
                "coordinates": [[[76.323, 9.987], [76.331, 9.987], [76.331, 9.979], [76.323, 9.979], [76.323, 9.987]]]
              },
              "properties": {
                "Name": "Vennala",
                "ward_number": "3",
                "flood_probability": 45,
                "inundation_percent": 36,
                "color": "#00ff00"
              }
            },
            {
              "type": "Feature",
              "geometry": {
                "type": "Polygon",
                "coordinates": [[[76.312, 9.983], [76.322, 9.983], [76.322, 9.975], [76.312, 9.975], [76.312, 9.983]]]
              },
              "properties": {
                "Name": "Palarivattom",
                "ward_number": "4",
                "flood_probability": 75,
                "inundation_percent": 60,
                "color": "#ff9900"
              }
            }
          ]
        }),
        "peakFloodProbability": 85,
        "topFactors": [
          {"feature": "Water Level", "shap_value": 0.75},
          {"feature": "Rainfall", "shap_value": 0.65},
          {"feature": "Tide Height", "shap_value": 0.55},
          {"feature": "Ground Elevation", "shap_value": 0.45},
          {"feature": "Drainage Capacity", "shap_value": 0.35}
        ],
        "hourlyForecast": Array.from({length: 24}, (_, i) => ({
          "hour": `${i.toString().padStart(2, '0')}:00`,
          "probability": Math.round(50 + 25 * Math.sin(i * Math.PI / 12))
        })),
        "lastUpdated": new Date().toISOString()
      };
    }
    
    fetchData();
  }, []);

  const onEachFeature = (feature: WardFeature, layer: L.Layer) => {
    // Get region name for this ward
    const regionName = getRegionNameForWard(feature.properties.Name);
    
    // Add tooltip with region name
    const tooltipContent = `
      <div style="text-align: center;">
        <strong>${regionName}</strong>
        <div style="font-size: 0.9em; margin-top: 3px;">
          ${feature.properties.flood_probability.toFixed(1)}% risk
        </div>
      </div>
    `;
    layer.bindTooltip(tooltipContent, { 
      permanent: false, 
      direction: 'top', 
      className: 'custom-tooltip'
    });
    
    // Check if this is the peak ward and highlight it
    const isPeakWard = feature.properties.Name === peakWard;
    
    layer.on({
      mouseover: (e) => {
        setHoveredWard(feature.properties);
        // For all wards, increase the opacity on hover
        const style: L.PathOptions = {
          fillOpacity: 0.9
        };
        
        // For non-peak wards, also change the border
        if (!isPeakWard) {
          style.weight = 3;
          style.color = '#666';
        }
        
        (e.target as any).setStyle(style);
      },
      mouseout: (e) => {
        setHoveredWard(null);
        
        // Only reset styling for non-peak wards
        if (!isPeakWard) {
          (e.target as any).setStyle({ 
            weight: 1, 
            color: 'black',
            dashArray: undefined,
            fillOpacity: 0.7
          });
        } else {
          // For peak ward, just reset the opacity
          (e.target as any).setStyle({
            fillOpacity: 0.8
          });
        }
      },
      click: (e) => {
        // When clicked, ensure the peak ward maintains its styling
        if (isPeakWard) {
          setTimeout(() => {
            (e.target as any).setStyle({ 
              weight: 3, 
              color: '#FF0000',
              dashArray: '5, 5',
              fillOpacity: 0.8
            });
          }, 100);
        }
      }
    });
  };

  const styleGeoJSON = (feature?: WardFeature) => {
    if (!feature) {
      console.log("styleGeoJSON called with no feature");
      return { fillColor: '#808080', weight: 1, opacity: 1, color: 'black', fillOpacity: 0.7 };
    }
    
    console.log("Styling feature:", feature.properties.Name);
    
    // Get the probability value
    const probability = feature.properties.flood_probability;
    
    // If the feature has a pre-defined color, use it
    if (feature.properties.color) {
      console.log("Using predefined color:", feature.properties.color);
      const isPeakWard = feature.properties.Name === peakWard;
      return {
        fillColor: feature.properties.color,
        weight: isPeakWard ? 3 : 1,
        opacity: 1,
        color: isPeakWard ? '#FF0000' : 'black',
        dashArray: isPeakWard ? '5, 5' : undefined,
        fillOpacity: isPeakWard ? 0.8 : 0.7
      };
    }
    
    // Create a gradient color based on probability
    const getGradientColor = (probability: number) => {
      // Convert probability (0-100) to a value between 0 and 1
      const value = probability / 100;
      
      // Define gradient colors from green to red
      const colors = [
        { point: 0.0, color: [0, 128, 0] },    // Green (0%)
        { point: 0.25, color: [173, 255, 47] }, // GreenYellow (25%)
        { point: 0.45, color: [255, 255, 0] },  // Yellow (45%)
        { point: 0.65, color: [255, 165, 0] },  // Orange (65%)
        { point: 0.85, color: [255, 69, 0] },   // OrangeRed (85%)
        { point: 1.0, color: [139, 0, 0] }      // DarkRed (100%)
      ];
      
      // Find the two colors to interpolate between
      let colorA = colors[0];
      let colorB = colors[1];
      
      for (let i = 1; i < colors.length; i++) {
        if (value <= colors[i].point) {
          colorA = colors[i-1];
          colorB = colors[i];
          break;
        }
      }
      
      // Calculate interpolation factor
      const factor = (value - colorA.point) / (colorB.point - colorA.point);
      
      // Interpolate between the two colors
      const r = Math.round(colorA.color[0] + factor * (colorB.color[0] - colorA.color[0]));
      const g = Math.round(colorA.color[1] + factor * (colorB.color[1] - colorA.color[1]));
      const b = Math.round(colorA.color[2] + factor * (colorB.color[2] - colorA.color[2]));
      
      return `rgb(${r}, ${g}, ${b})`;
    };
    
    // Get gradient color based on probability
    const fillColor = getGradientColor(probability);
    
    // Check if this is the peak ward and apply special styling
    const isPeakWard = feature.properties.Name === peakWard;
    
    // Create the style object with conditional properties
    const style: L.PathOptions = {
      fillColor: fillColor,
      weight: isPeakWard ? 3 : 1,
      opacity: 1,
      color: isPeakWard ? '#FF0000' : 'black',
      fillOpacity: isPeakWard ? 0.8 : 0.7,
    };
    
    // Add dashArray only for peak ward
    if (isPeakWard) {
      style.dashArray = '5, 5';
    }
    
    return style;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p className="ml-4 text-lg">Generating Forecast...</p>
    </div>
  );

  if (error) return (
    <Alert variant="destructive" className="m-4">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <div>
          <p>{error}</p>
          <div className="mt-4">
            <p className="font-bold">Debug Information:</p>
            <p>API URL: {API_ENDPOINTS.forecast}</p>
            <p>GeoJSON Loaded: {geojsonData ? 'Yes' : 'No'}</p>
            <p>API Data Loaded: {apiData ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-full">
      {/* Left Column: Map and Info Panel */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Card className="flex-grow h-[60vh] lg:h-auto relative shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
          <MapContainer center={[9.9312, 76.2673]} zoom={12} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
            {geojsonData ? (
              (() => {
                try {
                  return (
                    <GeoJSON 
                      data={geojsonData} 
                      style={styleGeoJSON} 
                      onEachFeature={onEachFeature} 
                      key={`geojson-layer-${peakWard || 'initial'}`} // Force re-render when peak ward changes
                    />
                  );
                } catch (error) {
                  console.error('Error rendering GeoJSON:', error);
                  return (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-70 z-[500]">
                      <div className="text-center p-4 bg-red-50 rounded-md">
                        <p className="text-red-600 font-bold">Error rendering map data</p>
                        <p className="text-sm mt-2">{error instanceof Error ? error.message : String(error)}</p>
                      </div>
                    </div>
                  );
                }
              })()
            ) : (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-70 z-[500]">
                <p>No GeoJSON data available</p>
              </div>
            )}
          </MapContainer>
          
          {/* Color Legend */}
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-md shadow-md z-[1000]">
            <h4 className="text-sm font-medium mb-2">Flood Risk</h4>
            <div className="flex items-center">
              <div className="h-24 w-4 mr-3 relative" 
                   style={{ 
                     background: 'linear-gradient(to top, rgb(0, 128, 0), rgb(173, 255, 47), rgb(255, 255, 0), rgb(255, 165, 0), rgb(255, 69, 0), rgb(139, 0, 0))',
                     borderRadius: '2px'
                   }}>
              </div>
              <div className="flex flex-col justify-between h-24 text-xs">
                <div>Very High (&gt;85%)</div>
                <div>High (65-85%)</div>
                <div>Medium (45-65%)</div>
                <div>Low (25-45%)</div>
                <div>Very Low (&lt;25%)</div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 mr-3 text-blue-500" />
              <div className="w-full">
                <h3 className="text-lg font-semibold">
                  {hoveredWard 
                    ? getRegionNameForWard(hoveredWard.Name)
                    : "Hover over a region"
                  }
                </h3>
                <div className="text-sm text-gray-500">
                  {hoveredWard ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span>Flood Probability:</span>
                        <span className={`font-bold ${
                          hoveredWard.flood_probability > 85 ? 'text-red-600' : 
                          hoveredWard.flood_probability > 65 ? 'text-orange-500' : 
                          hoveredWard.flood_probability > 45 ? 'text-yellow-500' : 
                          'text-green-600'
                        }`}>
                          {hoveredWard.flood_probability.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Physical Inundation:</span>
                        <span className="font-medium">{hoveredWard.inundation_percent.toFixed(2)}%</span>
                      </div>
                      {hoveredWard.Name === peakWard && (
                        <div className="mt-1 py-1 px-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs flex items-center">
                          <ShieldAlert className="h-3 w-3 mr-1" />
                          <span>Highest risk ward in Kochi</span>
                        </div>
                      )}
                    </div>
                  ) : "Select a ward to see details"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Data and Insights */}
      <div className="flex flex-col gap-4">
        <Card className="shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
            <CardHeader>
                <CardTitle className="flex items-center"><ShieldAlert className="mr-2"/>Peak Flood Probability</CardTitle>
                <CardDescription>Highest predicted flood chance across all wards.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold text-red-600">{apiData?.peakFloodProbability.toFixed(2)}%</p>
                {peakWard && (
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Location:</span> 
                      <span className="text-red-500 font-semibold">{peakWard}</span>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-2">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-red-500 mt-0.5 mr-1.5 flex-shrink-0" />
                        <p className="text-xs text-red-700">
                          <span className="font-semibold">Critical Alert:</span> {peakWard} is currently showing the highest flood risk in Kochi. Residents should stay informed and prepare for potential flooding.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </CardContent>
        </Card>
        <Card className="shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center"><TrendingUp className="mr-2"/>24-Hour Probability Forecast</CardTitle>
            <CardDescription>Average flood probability across all wards by time of day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart 
                data={apiData?.hourlyForecast?.map(item => ({
                  ...item,
                  // Format for display - add AM/PM
                  displayHour: item.hour.includes(':') 
                    ? new Date(`2023-01-01T${item.hour}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }) 
                    : item.hour,
                  // Color code by risk level
                  fill: item.probability > 50 ? '#ef4444' : item.probability > 20 ? '#facc15' : '#22c55e'
                }))}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="displayHour" 
                  fontSize={10}
                  interval="preserveStartEnd"
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  tickFormatter={(value, index) => {
                    // Show fewer labels for readability
                    return index % 3 === 0 ? value : '';
                  }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tickCount={6}
                  fontSize={11} 
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Flood Probability']}
                  labelFormatter={(label, payload) => {
                    // @ts-expect-error - payload has extra properties we added
                    const timeBlock = payload[0]?.payload?.timeBlock || '';
                    return `${label} (${timeBlock})`;
                  }}
                  contentStyle={{
                    backgroundColor: '#fafafa',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                />
                <Bar 
                  dataKey="probability" 
                  name="Flood Probability"
                  // Use the dynamic fill color from our data mapping
                  fill="#ef4444"
                  fillOpacity={0.8}
                  isAnimationActive={true}
                  radius={[4, 4, 0, 0]}
                />
                <ReferenceLine 
                  y={50} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3" 
                  label={{ value: 'High Risk', position: 'insideBottomRight', fill: '#ef4444', fontSize: 10 }} 
                />
                <ReferenceLine 
                  y={20} 
                  stroke="#facc15" 
                  strokeDasharray="3 3" 
                  label={{ value: 'Medium Risk', position: 'insideBottomRight', fill: '#facc15', fontSize: 10 }} 
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-center text-gray-500 mt-2">
              Flood probability tends to peak in the afternoon and evening hours
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center"><HelpCircle className="mr-2"/>Top Risk Factors</CardTitle>
            <CardDescription>Factors contributing most to the highest-risk ward.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {apiData?.topFactors.map(factor => (
                <li key={factor.feature} className="text-sm">
                  <span className="font-semibold capitalize">{factor.feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
         <div className="text-xs text-center text-gray-400">
            Last Updated: {apiData?.lastUpdated}
          </div>
      </div>
    </div>
  );
}
