/*
 * ENTRY WRAPPER
 * -------------------------
 * This component is used to wrap an item that should be
 * animated with when it enters the viewport.
 */
"use client";

import {
	EasingFunction,
	HTMLMotionProps,
	motion,
	Variants,
} from "motion/react";

export default function ItemEntryWrapper({
	children,
	className,
	ref,
	variants = {
		hidden: { opacity: 0, y: 10 },
		visible: { opacity: 1, y: 0 },
	},
	delay = 0,
	duration = 0.3,
	ease = "easeInOut",
	...props
}: {
	children?: React.ReactNode;
	className?: string;
	ref?: React.RefObject<HTMLDivElement | null>;
	variants?: Variants;
	delay?: number;
	duration?: number;
	ease?: string | EasingFunction;
} & HTMLMotionProps<"div">) {
	return (
		<motion.div
			variants={variants}
			animate="visible"
			initial="hidden"
			className={className}
			ref={ref as React.Ref<HTMLDivElement>}
			transition={{
				delay,
				duration,
				ease,
			}}
			{...props}
		>
			{children}
		</motion.div>
	);
}
