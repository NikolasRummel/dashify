"use client";

import { motion, Variants } from "motion/react";
import React from "react";
import { Input } from "./input";

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

export default function AiInput({
	...props
}: React.ComponentProps<typeof Input>) {
	return (
		<div className="relative inline-block">
			<motion.div
				initial="initial"
				animate="loop"
				variants={gradientVariants as Variants}
				className="absolute inset-0 z-[-1] rounded-full filter blur-xl opacity-50 dark:opacity-100"
			/>
			<div className="relative rounded-full">
				<Input
					variant="ai"
					placeholder="What do you want to cook?"
					{...props}
				/>
			</div>
		</div>
	);
}
