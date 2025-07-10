"use client";

import {
	dashboardBackgroundState,
	dashboardCurrentPageState,
	dashboardIsEditingState,
	dashboardsState,
} from "@/atoms/dashboard";
import { GridStackGrid } from "@/components/pages/dashboard/gridstack/grid-stack-grid";
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import ItemEntryWrapper from "@/components/wrappers/motion/entry-wrapper";
import { useSession } from "@/hooks/use-session";
import axiosInstance from "@/lib/api/axios";
import { easeOutBounce } from "@/lib/motion";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

export default function DashboardsCarousel() {
	const { user } = useSession();
	const setBackground = useSetAtom(dashboardBackgroundState);
	const [dashboards, setDashboards] = useAtom(dashboardsState);
	const [loading, setLoading] = useState(true);
	const [current, setCurrent] = useAtom(dashboardCurrentPageState);
	const isEditing = useAtomValue(dashboardIsEditingState);

	const [api, setApi] = useState<CarouselApi>();

	// Fetch dashboard data
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axiosInstance.get("/api/dashboards/all");
				setDashboards(response.data);
				setLoading(false);
			} catch {}
		};
		fetchData();
	}, []);

	// Programmatically control the carousel
	useEffect(() => {
		if (!api) return;
		setCurrent(api.selectedScrollSnap());
		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
		api.scrollTo(current);
	}, [api, dashboards, setCurrent, current]);

	// Set background
	useEffect(() => {
		if (user?.backgroundImage) {
			setBackground(user.backgroundImage);
		}
	}, [user, setBackground]);

	// Set accent color
	useEffect(() => {
		if (user?.accentColor) {
			if (user.accentColor === "auto") {
				document.documentElement.style.removeProperty(
					"--widget-accent",
				);
			} else {
				document.documentElement.style.setProperty(
					"--widget-accent",
					user.accentColor,
				);
			}
		}
	}, [user]);

	if (loading) {
		return;
	}

	return (
		<ItemEntryWrapper
			variants={{
				hidden: {
					scale: 10,
				},
				visible: {
					scale: 1,
				},
			}}
			duration={1.5}
			ease={easeOutBounce}
			className="flex h-full w-full flex-col items-center justify-center"
		>
			<Carousel
				className="h-fit w-full"
				setApi={setApi}
				opts={{
					watchDrag: !isEditing,
					dragFree: isEditing,
				}}
				plugins={[WheelGesturesPlugin()]}
			>
				<CarouselContent className="h-full">
					{dashboards.map((dashboard) => (
						<CarouselItem
							key={dashboard.id}
							className="flex h-full w-full items-center justify-center p-16"
						>
							<GridStackGrid
								dashboard={dashboard}
								isCurrentlyVisible={
									dashboard.id === dashboards[current]?.id
								}
							/>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</ItemEntryWrapper>
	);
}
