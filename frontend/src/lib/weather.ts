import { MetNoForecastResponse } from "@/types/weather";
import axios from "axios";

/**
 * Fetches weather forecast data from the Met.no API for a specific location.
 * @param lat - The latitude of the location
 * @param lon - The longitude of the location
 * @returns A promise that resolves to the weather forecast data
 * @throws Will throw an error if the API request fails
 * @example
 * const forecast = await getWeatherForecast(59.9139, 10.7522); // Oslo coordinates
 */
export async function getWeatherForecast(
	lat: number,
	lon: number,
): Promise<MetNoForecastResponse> {
	const url = `https://api.met.no/weatherapi/locationforecast/2.0?lat=${lat}&lon=${lon}`;
	const response = await axios.get(url);
	const data = response.data;

	return data as MetNoForecastResponse;
}
