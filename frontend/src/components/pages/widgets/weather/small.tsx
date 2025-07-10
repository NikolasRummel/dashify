"use client";

import { WeatherDescription } from "@/components/ui/weather-description";
import WeatherIcon from "@/components/ui/weather-icon";
import useGeolocation from "@/hooks/use-geolocation";
import { Address, coordinateLoopup } from "@/lib/map";
import { getWeatherForecast } from "@/lib/weather";
import { MetNoForecastResponse } from "@/types/weather";
import { useEffect, useState } from "react";

export default function WeatherSmall() {
	const { loading, coordinates, error } = useGeolocation();
	const [weatherData, setWeatherData] = useState<MetNoForecastResponse>();
	const [address, setAddress] = useState<Address>();

	useEffect(() => {
		if (loading) return;
		if (error) return;
		if (!coordinates?.latitude || !coordinates?.longitude) return;

		getWeatherForecast(coordinates?.latitude, coordinates?.longitude).then(
			(data) => {
				if (data) {
					setWeatherData(data);
					coordinateLoopup(
						coordinates?.latitude,
						coordinates?.longitude,
					).then((address) => {
						if (address) {
							setAddress(address);
						}
					});
				}
			},
		);
	}, [coordinates, error, loading]);

	if (loading || !address) return;

	const temperature =
		weatherData?.properties?.timeseries[0]?.data?.instant.details
			?.air_temperature;
	const symbol_code =
		weatherData?.properties?.timeseries[0]?.data?.next_1_hours?.summary
			.symbol_code;
	const high =
		weatherData?.properties?.timeseries[0]?.data?.next_6_hours?.details
			?.air_temperature_max;
	const low =
		weatherData?.properties?.timeseries[0]?.data?.next_6_hours?.details
			?.air_temperature_min;

	return (
		<div className="flex h-full w-full flex-col p-3 text-white">
			{/* Location */}
			<p className="text-xs font-medium text-widget-accent leading-3">
				{address?.city ?? address?.town ?? address?.village}
			</p>
			{/* Current Temperature */}
			<span className="text-[40px] leading-11 font-semibold text-white">
				{temperature?.toFixed(0) ?? 0}°
			</span>
			<div className="flex w-full flex-col text-xs font-medium text-white/70">
				{/* Weather Icon */}
				<WeatherIcon
					symbolCode={symbol_code}
					className="h-full aspect-square text-lg text-widget-accent"
				/>
				{/* Weather Description */}
				<span>
					<WeatherDescription symbolCode={symbol_code} />
				</span>
				{/* High / Low */}
				<span>
					H: {high?.toFixed(0) ?? 0}° L: {low?.toFixed(0) ?? 0}°
				</span>
			</div>
		</div>
	);
}
