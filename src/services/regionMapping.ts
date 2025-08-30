// services/regionMapping.ts
import axios from 'axios';

// Define interfaces
export interface RegionData {
  wardId: string;
  regionName: string;
}

// This will be our mapping of wards to region names
// Initially empty but will be populated from API/static data
let wardToRegionMap: Record<string, string> = {};

/**
 * Fetch region names corresponding to wards from OpenStreetMap data
 * Uses Overpass API to query OSM for neighborhood/suburb data
 */
export const fetchRegionNames = async (): Promise<Record<string, string>> => {
  try {
    // If we already have the data, return it
    if (Object.keys(wardToRegionMap).length > 0) {
      return wardToRegionMap;
    }

    // Define the Overpass API query for Kochi neighborhoods
    // This query looks for all neighborhood/suburb nodes in Kochi
    const query = `
      [out:json];
      area["name"="Kochi"]["admin_level"="4"];
      (
        node["place"="suburb"](area);
        node["place"="neighbourhood"](area);
        relation["place"="suburb"](area);
        relation["place"="neighbourhood"](area);
      );
      out body;
    `;

    // Use the Overpass API to fetch region data
    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Process the response to create a mapping of regions
    // This is a simplified example and would need to be adapted
    // based on the actual data structure returned by Overpass
    if (response.data && response.data.elements) {
      response.data.elements.forEach((element: any) => {
        if (element.tags && element.tags.name) {
          // Here we would match regions to wards based on coordinates
          // This is a complex geospatial operation that would require
          // knowing which wards correspond to which regions
          // For now, we'll create a dummy mapping as a placeholder
        }
      });
    }

    // In a real implementation, we would match the OSM regions to wards
    // Since that requires geospatial analysis, for now let's use a static mapping
    // This is where you would replace with actual region names for each ward
    wardToRegionMap = {
      'Ward-1': 'Fort Kochi',
      'Ward-2': 'Mattancherry',
      'Ward-3': 'Palluruthy',
      'Ward-4': 'Edakochi',
      'Ward-5': 'Thoppumpady',
      'Ward-6': 'Vennala',
      'Ward-7': 'Elamkulam',
      'Ward-8': 'Kadavanthra',
      'Ward-9': 'Panampilly Nagar',
      'Ward-10': 'Ernakulam South',
      'Ward-11': 'Ernakulam North',
      'Ward-12': 'Willingdon Island',
      'Ward-13': 'Thevara',
      'Ward-14': 'Perumanoor',
      'Ward-15': 'Marine Drive',
      // Add more mappings as needed
    };

    return wardToRegionMap;
  } catch (error) {
    console.error('Error fetching region data:', error);
    // Return an empty object in case of error
    return {};
  }
};

/**
 * Get the region name for a given ward
 * If the mapping hasn't been loaded yet, returns the ward name
 */
export const getRegionNameForWard = (wardName: string): string => {
  if (Object.keys(wardToRegionMap).length === 0) {
    // If data isn't loaded yet, just return the ward number
    const wardNumber = wardName.split('-')[1];
    return `Ward ${wardNumber}`;
  }
  
  return wardToRegionMap[wardName] || wardName;
};
