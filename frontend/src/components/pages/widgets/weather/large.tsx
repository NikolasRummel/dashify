"use client";

import { Separator } from "@/components/ui/separator";
import { WeatherDescription } from "@/components/ui/weather-description";
import WeatherIcon from "@/components/ui/weather-icon";
import useGeolocation from "@/hooks/use-geolocation";
import { Address, coordinateLoopup } from "@/lib/map";
import { getWeatherForecast } from "@/lib/weather";
import { MetNoForecastResponse } from "@/types/weather";
import { useEffect, useState } from "react";

export default function WeatherLarge() {
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

	const temperatureFiveHourTrend = weatherData?.properties?.timeseries
		?.map((forecast) => {
			return {
				time: forecast.time,
				temperature: forecast.data.instant?.details?.air_temperature,
				symbol_code: forecast.data.next_1_hours?.summary.symbol_code,
			};
		})
		.slice(1, 6);

	const minMaxTemperatureFiveDayTrend = weatherData?.properties?.timeseries
		?.filter((forecast) => {
			const date = new Date(forecast.time);
			return (
				date.getUTCHours() === 0 &&
				date.getUTCMinutes() === 0 &&
				date.getUTCDate() !== new Date().getUTCDate()
			);
		})
		?.map((forecast) => {
			return {
				time: forecast.time,
				high: forecast.data.next_6_hours?.details?.air_temperature_max,
				low: forecast.data.next_6_hours?.details?.air_temperature_min,
				symbol_code: forecast.data.next_6_hours?.summary.symbol_code,
			};
		})
		.slice(0, 5);

	return (
		<div className="flex h-full font-medium w-full flex-col p-3 text-white/70 leading-3 text-xs">
			{/* Location */}
			<p className="text-widget-accent">
				{address?.city ?? address?.town ?? address?.village}
			</p>

			<div className="flex flex-col items-end absolute top-0 right-0 p-3">
				{/* Weather Icon */}
				<WeatherIcon
					symbolCode={symbol_code}
					className="h-full aspect-square text-lg text-widget-accent"
				/>
				{/* Weather Descriptions */}
				<span>
					<WeatherDescription symbolCode={symbol_code} />
				</span>
				{/* High / Low */}
				<span>
					H: {high?.toFixed(0) ?? 0}° L: {low?.toFixed(0) ?? 0}°
				</span>
			</div>
			{/* Current Temperature */}
			<span className="text-[40px] leading-11 font-semibold text-white">
				{temperature?.toFixed(0) ?? 0}°
			</span>
			{/* Temperature Trend (5 hours) */}
			<div className="w-full h-full flex flex-row">
				{temperatureFiveHourTrend?.map((data, index) => (
					<div
						key={index}
						className="flex flex-col items-center justify-between w-full"
					>
						<span className="text-white/70 text-[10px]">
							{new Date(data.time).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
						<WeatherIcon
							symbolCode={data.symbol_code}
							className="h-full aspect-square text-lg text-white"
						/>
						<span className="text-white/70">
							{data.temperature?.toFixed(0) ?? 0}°
						</span>
					</div>
				))}
			</div>
			<Separator className="my-2" />
			{/* Min- / Max-Temperature Trend (5 days) */}
			<div className="h-full flex flex-col justify-between gap-2 px-2">
				{minMaxTemperatureFiveDayTrend?.map((data, index) => (
					<div
						key={index}
						className="flex flex-row items-center gap-4 w-full"
					>
						<span className="text-white/70 w-6">
							{new Date(data.time).toLocaleDateString([], {
								weekday: "short",
							})}
						</span>
						<WeatherIcon
							symbolCode={data.symbol_code}
							className="h-full aspect-square text-lg text-white w-6"
						/>
						<MinMaxTemperatureBar
							min={data.low ?? 0}
							max={data.high ?? 0}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

function MinMaxTemperatureBar({ min, max }: { min: number; max: number }) {
	const rangeMin = min - 1;
	const rangeMax = max + 1;

	const minPercentage = ((min - rangeMin) / (rangeMax - rangeMin)) * 100;
	const maxPercentage = ((max - rangeMin) / (rangeMax - rangeMin)) * 100;

	return (
		<div className="flex flex-row items-center justify-between w-full gap-2">
			<span className="text-white/70 w-8 text-center">
				{min.toFixed(0)}°
			</span>
			{/* BAR HERE */}
			<div className="relative w-full bg-white/20 h-0.5 rounded-full">
				<div
					className="absolute bg-widget-accent/80 h-0.5 rounded-full"
					style={{
						right: `${minPercentage}%`,
						width: `${maxPercentage - minPercentage}%`,
					}}
				/>
			</div>
			<span className="text-white/70 text-center">{max.toFixed(0)}°</span>
		</div>
	);
}
