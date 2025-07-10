/*
 * STAGGER ITEM WRAPPER
 * -------------------------
 * This component is used to wrap individual items you want to stagger.
 * It is used in conjunction with the stagger container wrapper.
 */
"use client";

import { EasingFunction, motion, Variants } from "motion/react";
import { createElement } from "react";

export default function StaggerItemWrapper({
	children,
	className,
	variants,
	duration = 0.3,
	ease = "easeInOut",
	type = "div",
}: {
	children: React.ReactNode;
	className?: string;
	variants?: Variants;
	duration?: number;
	ease?: string | EasingFunction;
	type?:
		| "div"
		| "span"
		| "section"
		| "article"
		| "aside"
		| "header"
		| "footer"
		| "tr";
}) {
	const itemVariants =
		variants ||
		({
			hidden: { opacity: 0, y: 16 },
			visible: { opacity: 1, y: 0 },
		} as Variants);

	const itemTransition = {
		duration: duration,
		ease: ease,
	};

	return createElement(
		motion[type],
		{ variants: itemVariants, transition: itemTransition, className },
		children,
	);
}
