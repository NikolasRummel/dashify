"use client";

import { LatLngExpression, LatLngTuple } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import Image from "next/image";

type MapProps = {
	position: LatLngExpression | LatLngTuple;
	zoom?: number;
	showMarker: boolean;
};

export default function Map({
	position,
	zoom = 15,
	showMarker = true,
}: MapProps) {
	return (
		<MapContainer
			center={position}
			zoom={zoom}
			scrollWheelZoom={false}
			zoomControl={false}
			attributionControl={false}
			style={{ height: "100%", width: "100%" }}
			className="relative"
		>
			<TileLayer
				url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
				className="dark:hidden"
			/>
			<TileLayer
				url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
				className="hidden dark:block"
			/>
			{showMarker && (
				<>
					<div className="pointer-events-none absolute top-1/2 left-1/2 z-[1000] size-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-3 border-white bg-blue-500 shadow-xl shadow-black/40" />
					<Image
						src="/map-radar.svg"
						alt="Map Radar"
						height={48}
						width={48}
						className="animate-entry-spin absolute top-1/2 left-1/2 z-[900] -my-6 origin-bottom -translate-x-1/2 -translate-y-1/2"
					/>
				</>
			)}
		</MapContainer>
	);
}
