import { LinearBlur } from "@/components/ui/linear-progressive-blur";
import { Skeleton } from "@/components/ui/skeleton";
import ItemEntryWrapper from "@/components/wrappers/motion/entry-wrapper";
import useGeolocation from "@/hooks/use-geolocation";
import { Address, coordinateLoopup } from "@/lib/map";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function SmallMap() {
	const { coordinates, error, loading } = useGeolocation();
	const [address, setAddress] = useState<Address>();

	useEffect(() => {
		if (!error) {
			if (coordinates) {
				const { latitude, longitude } = coordinates;
				coordinateLoopup(latitude, longitude)
					.then((address) => {
						setAddress(address);
					})
					.catch((err) => {
						toast.error("Fehler beim Abrufen der Adresse");
						console.error(err);
					});
			}
		}
	}, [error, coordinates]);

	const Map = useMemo(
		() =>
			dynamic(() => import("@/components/ui/map"), {
				loading: () => (
					<Image
						src="/map-loading-skeleton.jpg"
						alt="Loading..."
						fill
					/>
				),
				ssr: false,
			}),
		[],
	);

	return (
		<div className="pointer-events-none relative size-full">
			<LinearBlur
				side="bottom"
				className="absolute -right-1 -bottom-1 -left-1 z-[1000] h-2/3"
				tint="color-mix(in oklab, var(--color-widget-accent) 40%, var(--primary-foreground))"
			/>
			<div className="absolute -right-1 -bottom-1 -left-1 z-[1000] flex h-1/2 flex-col justify-center gap-1 px-4">
				{loading ? (
					<>
						<Skeleton className="bg-primary/30 h-[12px] w-full rounded!" />
						<Skeleton className="bg-primary/30 h-[10px] w-1/2 rounded!" />
					</>
				) : (
					<ItemEntryWrapper
						variants={{
							hidden: {
								opacity: 0,
								filter: "blur(8px)",
							},
							visible: {
								opacity: 1,
								filter: "blur(0px)",
							},
						}}
						duration={1}
						className="flex flex-col gap-1"
					>
						<p className="text-primary line-clamp-1 text-[12px] leading-3.5 font-semibold overflow-ellipsis duration-300">
							{`${address?.road ?? ""} ${address?.house_number ?? ""}`}
						</p>
						<p className="text-muted-foreground line-clamp-1 text-[10px] leading-2 font-medium duration-300">
							{address?.city ?? address?.town ?? address?.village}
						</p>
					</ItemEntryWrapper>
				)}
			</div>
			<Map
				position={
					coordinates
						? [coordinates.latitude, coordinates.longitude]
						: [0, 0]
				}
				showMarker
			/>
		</div>
	);
}
