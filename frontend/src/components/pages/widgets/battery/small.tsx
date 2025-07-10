"use client";

import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import useBattery from "@/hooks/use-battery";
import { easeOutQuart } from "@/lib/motion";
import { motion } from "motion/react";
import {
	IoBatteryDead,
	IoBatteryFull,
	IoBatteryHalf,
	IoFlash,
} from "react-icons/io5";
import { NotSupportedByBrowserError } from "../errors/not-supported-by-browser";

export default function BatterySmall() {
	const { charging, level, supported } = useBattery();

	if (!supported) return <NotSupportedByBrowserError />;

	return (
		<div className="flex h-full w-full flex-col justify-between p-3.5">
			<AnimatedCircularProgressBar
				gaugePrimaryColor="var(--color-widget-accent)"
				gaugeSecondaryColor="rgba(255, 255, 255, 0.25)"
				value={level ?? 0}
				max={100}
				min={0}
				showValue={false}
				centerIcon={
					<AnimatedBatteryStatusIcon
						batteryLevel={level ?? 0}
						isCharging={charging ?? false}
					/>
				}
				className="h-14 w-14"
			/>
			<div className="text-4xl font-normal text-white">
				{level?.toFixed(0)}%
			</div>
		</div>
	);
}

function AnimatedBatteryStatusIcon({
	batteryLevel,
	isCharging,
}: {
	batteryLevel: number;
	isCharging: boolean;
}) {
	return (
		<div>
			{batteryLevel === 0 ? (
				<IoBatteryDead className="size-6 text-white" />
			) : batteryLevel <= 50 ? (
				<IoBatteryHalf className="size-6 text-white" />
			) : (
				<IoBatteryFull className="size-6 text-white" />
			)}
			{isCharging && (
				<motion.div
					initial={{ opacity: 0.3, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0.8, scale: 0.2 }}
					transition={{
						duration: 1,
						repeat: Infinity,
						repeatType: "reverse",
						ease: easeOutQuart,
					}}
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				>
					<IoFlash className="-ml-[1px] size-5 text-widget-accent" />
				</motion.div>
			)}
		</div>
	);
}
