import axios from "axios";

/**
 * Cache for storing address lookups to minimize API calls.
 * Maps coordinate strings to Address objects.
 */
const cache = new Map<string, Address>();

/**
 * Represents a structured address with various optional components.
 * Used for reverse geocoding results from OpenStreetMap.
 */
export type Address = {
	amenity?: string;
	road?: string;
	house_number?: string;
	neighbourhood?: string;
	suburb?: string;
	city?: string;
	town?: string;
	village?: string;
	state?: string;
	postalcode?: string;
	country?: string;
	country_code?: string;
};

/**
 * Performs reverse geocoding to get an address from coordinates.
 * Uses OpenStreetMap's Nominatim service and implements caching.
 * @param lat - The latitude coordinate
 * @param lon - The longitude coordinate
 * @returns A promise that resolves to the address information
 * @throws Will throw an error if the API request fails
 * @example
 * const address = await coordinateLoopup(59.9139, 10.7522); // Oslo coordinates
 */
export async function coordinateLoopup(
	lat: number,
	lon: number,
): Promise<Address> {
	const cacheKey = `${lat},${lon}`;

	// Check if coordinates are already in cache
	if (cache.has(cacheKey)) {
		return cache.get(cacheKey)!;
	}

	const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
	const response = await axios.get(url);
	const data = response.data;

	// Store result in cache
	const address = data.address as Address;
	cache.set(cacheKey, address);

	return address;
}
