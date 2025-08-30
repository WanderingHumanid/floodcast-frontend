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
    wardToRegionMap ={
  "Ward-1": "Fort Kochi",
  "Ward-2": "Kalvathy",
  "Ward-3": "Earaveli",
  "Ward-4": "Karippalam",
  "Ward-5": "Mattanchery",
  "Ward-6": "Kochangadi",
  "Ward-7": "Cheralayi",
  "Ward-8": "Panayappilly",
  "Ward-9": "Chakkamadom",
  "Ward-10": "Karuvelippady",
  "Ward-11": "Thoppumpady",
  "Ward-12": "Tharebhagam",
  "Ward-13": "Kadebhagam",
  "Ward-14": "Thazhuppu",
  "Ward-15": "Eadakochi North",
  "Ward-16": "Edakochi South",
  "Ward-17": "Perumbadappu",
  "Ward-18": "Konam",
  "Ward-19": "Kacheripady",
  "Ward-20": "Nambyapuram",
  "Ward-21": "Pullardesam",
  "Ward-22": "Mundamvelly",
  "Ward-23": "Manasserry",
  "Ward-24": "Moolamkuzhy",
  "Ward-25": "Chullickal",
  "Ward-26": "Nazreth",
  "Ward-27": "Fortkochi veli",
  "Ward-28": "Amaravathy",
  "Ward-29": "Island North",
  "Ward-30": "Island South",
  "Ward-31": "Vaduthala West",
  "Ward-32": "Vaduthala East",
  "Ward-33": "Elamakkara North",
  "Ward-34": "Puthukkalavattam",
  "Ward-35": "Ponekkara",
  "Ward-36": "Kunnumpuram",
  "Ward-37": "Edappally",
  "Ward-38": "Dhevankulangara",
  "Ward-39": "Karukappilli",
  "Ward-40": "Mamangalam",
  "Ward-41": "Padivattam",
  "Ward-42": "Vennala",
  "Ward-43": "Palarivattam",
  "Ward-44": "Karanakkodam",
  "Ward-45": "Thammanam",
  "Ward-46": "Chakkaraparambu",
  "Ward-47": "Chalikkavattam",
  "Ward-48": "Ponnurunni East",
  "Ward-49": "Vyttila",
  "Ward-50": "Chambakkara",
  "Ward-51": "Poonithura",
  "Ward-52": "Vyttila Janatha",
  "Ward-53": "Ponnurunni",
  "Ward-54": "Elamkulam",
  "Ward-55": "Girinagar",
  "Ward-56": "Panampilli Nagar",
  "Ward-57": "Kadavanthra",
  "Ward-58": "Konthuruthy",
  "Ward-59": "Thevara",
  "Ward-60": "Perumanur",
  "Ward-61": "Ravipuram",
  "Ward-62": "Ernakulam South",
  "Ward-63": "Gandhi Nagar",
  "Ward-64": "Kathrikadavu",
  "Ward-65": "Kaloor South",
  "Ward-66": "Ernakulam Central",
  "Ward-67": "Ernakulam North",
  "Ward-68": "Ayyappankavu",
  "Ward-69": "Thrikkanarvattom",
  "Ward-70": "Kaloor North",
  "Ward-71": "Elamakkara South",
  "Ward-72": "Pottakuzhy",
  "Ward-73": "Pachalam",
  "Ward-74": "Thattazham"
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
