'use client';

import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { GeoJsonObject } from 'geojson';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

// --- Type Definitions ---
interface WardProperties {
  Name: string;
  inundation_percent: number;
  flood_probability: number;
  color: string;
}
interface WardFeature extends GeoJSON.Feature<GeoJSON.Geometry, WardProperties> {}
type WardGeoJson = GeoJsonObject & { features: WardFeature[] };

export default function SimpleFloodMap() {
  const [geojsonData, setGeojsonData] = useState<WardGeoJson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredWard, setHoveredWard] = useState<WardProperties | null>(null);
  const [peakWard, setPeakWard] = useState<string | null>(null);

  useEffect(() => {
    // Set a timeout to show error message after 1 minute
    const backendTimeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Taking too long? Maybe there is a problem with our backend. We sincerely apologize for your inconvenience.');
      }
    }, 60000); // 1 minute

    // Use mock data for demonstration - this would normally be replaced with API fetch
    try {
      const mockData = getMockData();
      console.log("Processing mock GeoJSON data...");
      const parsedGeoJson = JSON.parse(mockData.geoJson) as WardGeoJson;
      console.log(`Parsed GeoJSON features: ${parsedGeoJson.features.length} wards loaded`);
      
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
      
      setLoading(false);
    } catch (err) {
      setError('Failed to process data.');
      console.error(err);
      setLoading(false);
    }

    // Clean up function to clear timeout when component unmounts
    return () => {
      clearTimeout(backendTimeoutId);
    };
  }, []);

  const onEachFeature = (feature: WardFeature, layer: L.Layer) => {
    // Add tooltip with ward name
    const tooltipContent = `
      <div style="text-align: center;">
        <strong>${feature.properties.Name}</strong>
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
      }
    });
  };

  const styleGeoJSON = (feature?: WardFeature) => {
    if (!feature) {
      return { fillColor: '#808080', weight: 1, opacity: 1, color: 'black', fillOpacity: 0.7 };
    }
    
    // Get the probability value
    const probability = feature.properties.flood_probability;
    
    // If the feature has a pre-defined color, use it
    if (feature.properties.color) {
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

  // Function to provide mock data
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
      })
    };
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p className="ml-4 text-lg">Generating map...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-red-50 rounded-md">
      <p className="text-red-700 font-medium mb-2">{error}</p>
      <p className="text-sm text-gray-600">You can still navigate to other sections of the app.</p>
    </div>
  );

  return (
    <Card className="flex-grow h-full relative shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
      <MapContainer center={[9.9312, 76.2673]} zoom={12} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
        {geojsonData ? (
          <GeoJSON 
            data={geojsonData} 
            style={styleGeoJSON} 
            onEachFeature={onEachFeature} 
            key={`geojson-layer-${peakWard || 'initial'}`}
          />
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
  );
}
