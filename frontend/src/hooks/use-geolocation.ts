import { useEffect, useState } from "react";

/**
 * Represents a set of geographic coordinates.
 */
export type Coordinates = {
	latitude: number;
	longitude: number;
};

/**
 * Represents the current state of geolocation data.
 */
export type GeolocationData = {
	coordinates?: Coordinates;
	error?: string;
	loading: boolean;
};

/**
 * Hook for accessing the device's geolocation.
 * Provides the current position or error information.
 * Falls back gracefully if geolocation is not supported.
 *
 * @returns An object containing:
 * - coordinates: The current position (if available)
 * - error: Any error message (if geolocation failed)
 * - loading: Whether the position is still being determined
 *
 * @example
 * const { coordinates, error, loading } = useGeolocation();
 * if (coordinates) {
 *   console.log(`Location: ${coordinates.latitude}, ${coordinates.longitude}`);
 * }
 */
export default function useGeolocation(): GeolocationData {
	const [data, setData] = useState<GeolocationData>({
		coordinates: undefined,
		error: undefined,
		loading: true,
	});

	useEffect(() => {
		if (!navigator.geolocation) {
			setData({
				coordinates: undefined,
				error: "Geolocation wird von diesem Browser nicht unterstützt.",
				loading: false,
			});
			return;
		}

		const successHandler = (position: GeolocationPosition) => {
			setData({
				coordinates: {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				},
				error: undefined,
				loading: false,
			});
		};

		const errorHandler = (error: GeolocationPositionError) => {
			setData({
				coordinates: undefined,
				error: error.message,
				loading: false,
			});
		};

		navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
	}, []);

	return data;
}
