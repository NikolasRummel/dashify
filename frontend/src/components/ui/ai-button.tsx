"use client";

import { motion, Variants } from "motion/react";
import React from "react";
import { Button } from "./button";

const gradient = "linear-gradient(90deg, #329DF7, #D85E97, #F7644D, #FEB028)";

const gradientVariants = {
	initial: {
		background: gradient,
		backgroundSize: "300% 300%",
		backgroundPosition: "0% 0%",
	},
	loop: {
		backgroundSize: ["300% 300%", "250% 250%", "200% 200%", "150% 150%"],
		backgroundPosition: ["0% 0%", "100% 0%", "0% 0%", "100% 0%"],
		transition: {
			duration: 10,
			repeat: Infinity,
			repeatType: "reverse",
		},
	},
};

export default function AiButton({
	...props
}: React.ComponentProps<typeof Button>) {
	return (
		<div className="relative inline-block">
			<motion.div
				initial="initial"
				animate="loop"
				variants={gradientVariants as Variants}
				className="absolute inset-0 z-[-1] rounded-md filter blur-xl opacity-75 dark:opacity-100"
			/>
			<div className="relative rounded-md">
				<Button
					variant="ai"
					{...props}
				/>
			</div>
		</div>
	);
}
