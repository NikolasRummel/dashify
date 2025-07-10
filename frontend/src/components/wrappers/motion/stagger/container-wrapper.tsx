/*
 * STAGGER CONTAINER WRAPPER
 * -------------------------
 * This component is used to wrap a list of children components that you want to stagger.
 * Each individual item must then be wrapped in a stagger item wrapper.
 */
"use client";
import { motion } from "motion/react";

export default function StaggerContainerWrapper({
	children,
	className,
	staggerDelay = 0.03,
}: {
	children: React.ReactNode;
	className?: string;
	staggerDelay?: number;
}) {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: staggerDelay,
			},
		},
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className={className}
		>
			{children}
		</motion.div>
	);
}
