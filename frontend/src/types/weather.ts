/**
 * Response type from the Met.no weather API.
 * Contains forecast data including metadata and time series entries.
 */
export interface MetNoForecastResponse {
	type: string;
	geometry: {
		type: string;
		coordinates: [number, number, number]; // [lon, lat, altitude]
	};
	properties: {
		meta: {
			updated_at: string;
			units: {
				air_pressure_at_sea_level: string;
				air_temperature: string;
				cloud_area_fraction: string;
				precipitation_amount: string;
				relative_humidity: string;
				wind_from_direction: string;
				wind_speed: string;
				[key: string]: string;
			};
		};
		timeseries: TimeSeriesEntry[];
	};
}

/**
 * Represents a single time point in the weather forecast.
 * Contains current conditions and forecast summaries for different time periods.
 */
export interface TimeSeriesEntry {
	time: string; // ISO timestamp
	data: {
		instant: {
			details: {
				air_pressure_at_sea_level?: number;
				air_temperature?: number;
				cloud_area_fraction?: number;
				relative_humidity?: number;
				wind_from_direction?: number;
				wind_speed?: number;
				air_temperature_max?: number;
				air_temperature_min?: number;
				[key: string]: number | undefined;
			};
		};
		next_1_hours?: ForecastSummary;
		next_6_hours?: ForecastSummary;
		next_12_hours?: ForecastSummary;
	};
}

/**
 * Represents a weather forecast summary for a specific time period.
 * Contains weather symbol code and precipitation details.
 */
export interface ForecastSummary {
	summary: {
		symbol_code: SymbolCode;
	};
	details?: {
		precipitation_amount?: number;
		[key: string]: number | undefined;
	};
}

/**
 * Enumeration of all possible weather symbol codes from the Met.no API.
 * Includes variations for different times of day (day/night/polar twilight)
 * and different weather conditions (clear, cloudy, rain, snow, etc.).
 */
export type SymbolCode =
	| "clearsky_day"
	| "clearsky_night"
	| "clearsky_polartwilight"
	| "cloudy"
	| "fair_day"
	| "fair_night"
	| "fair_polartwilight"
	| "fog"
	| "heavyrain"
	| "heavyrainandthunder"
	| "heavyrainshowers_day"
	| "heavyrainshowers_night"
	| "heavyrainshowers_polartwilight"
	| "heavyrainshowersandthunder_day"
	| "heavyrainshowersandthunder_night"
	| "heavyrainshowersandthunder_polartwilight"
	| "heavysleet"
	| "heavysleetandthunder"
	| "heavysleetshowers_day"
	| "heavysleetshowers_night"
	| "heavysleetshowers_polartwilight"
	| "heavysleetshowersandthunder_day"
	| "heavysleetshowersandthunder_night"
	| "heavysleetshowersandthunder_polartwilight"
	| "heavysnow"
	| "heavysnowandthunder"
	| "heavysnowshowers_day"
	| "heavysnowshowers_night"
	| "heavysnowshowers_polartwilight"
	| "heavysnowshowersandthunder_day"
	| "heavysnowshowersandthunder_night"
	| "heavysnowshowersandthunder_polartwilight"
	| "lightrain"
	| "lightrainandthunder"
	| "lightrainshowers_day"
	| "lightrainshowers_night"
	| "lightrainshowers_polartwilight"
	| "lightrainshowersandthunder_day"
	| "lightrainshowersandthunder_night"
	| "lightrainshowersandthunder_polartwilight"
	| "lightsleet"
	| "lightsleetandthunder"
	| "lightsleetshowers_day"
	| "lightsleetshowers_night"
	| "lightsleetshowers_polartwilight"
	| "lightsnow"
	| "lightsnowandthunder"
	| "lightsnowshowers_day"
	| "lightsnowshowers_night"
	| "lightsnowshowers_polartwilight"
	| "lightssleetshowersandthunder_day"
	| "lightssleetshowersandthunder_night"
	| "lightssleetshowersandthunder_polartwilight"
	| "lightssnowshowersandthunder_day"
	| "lightssnowshowersandthunder_night"
	| "lightssnowshowersandthunder_polartwilight"
	| "partlycloudy_day"
	| "partlycloudy_night"
	| "partlycloudy_polartwilight"
	| "rain"
	| "rainandthunder"
	| "rainshowers_day"
	| "rainshowers_night"
	| "rainshowers_polartwilight"
	| "rainshowersandthunder_day"
	| "rainshowersandthunder_night"
	| "rainshowersandthunder_polartwilight"
	| "sleet"
	| "sleetandthunder"
	| "sleetshowers_day"
	| "sleetshowers_night"
	| "sleetshowers_polartwilight"
	| "sleetshowersandthunder_day"
	| "sleetshowersandthunder_night"
	| "sleetshowersandthunder_polartwilight"
	| "snow"
	| "snowandthunder"
	| "snowshowers_day"
	| "snowshowers_night"
	| "snowshowers_polartwilight"
	| "snowshowersandthunder_day"
	| "snowshowersandthunder_night"
	| "snowshowersandthunder_polartwilight";
