"use client";

import { cn } from "@/lib/utils";
import {
	AnimatePresence,
	motion,
	TargetAndTransition,
	Transition,
} from "motion/react";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

interface AnimatedTextProps {
	children: React.ReactNode;
	splitBy?: "characters" | "words" | "lines" | string;
	className?: string;
	transition?: Transition;
	initial?: TargetAndTransition;
	animate?: TargetAndTransition;
	exit?: TargetAndTransition;
	elementClassName?: string;
	staggerDuration?: number;
	duration?: number;
}

export default function AnimatedText({
	children,
	splitBy = "characters",
	className,
	transition = { type: "spring", damping: 40, stiffness: 300, clamp: true },
	// use numeric y values so motion appends "px" automatically
	initial = { y: 32, opacity: 0, filter: "blur(8px)" },
	animate = { y: 0, opacity: 1, filter: "blur(0px)" },
	exit = { y: -32, opacity: 0, filter: "blur(8px)" },
	elementClassName,
	staggerDuration = 0.0035,
	duration = 1,
}: AnimatedTextProps) {
	const containerRef = useRef<HTMLSpanElement>(null);
	const measureRef = useRef<HTMLSpanElement>(null);

	const text = useMemo(
		() =>
			React.Children.toArray(children)
				.map((c) =>
					typeof c === "string" || typeof c === "number"
						? String(c)
						: "",
				)
				.join(""),
		[children],
	);

	const [visibleText, setVisibleText] = useState(text);

	const splitIntoCharacters = useCallback((input: string): string[] => {
		if (
			typeof Intl !== "undefined" &&
			typeof Intl.Segmenter === "function"
		) {
			const segmenter = new Intl.Segmenter("en", {
				granularity: "grapheme",
			});
			return Array.from(segmenter.segment(input), (s) => s.segment);
		}
		return Array.from(input);
	}, []);

	const textChunks = useMemo(() => {
		const segments =
			splitBy === "lines"
				? visibleText.split("\n")
				: splitBy === "words"
					? visibleText.split(" ")
					: splitBy === "characters"
						? splitIntoCharacters(visibleText)
						: visibleText.split(splitBy);

		return segments.map((segment, idx) => ({
			parts:
				splitBy === "characters"
					? [segment]
					: splitIntoCharacters(segment),
			needsSpace: idx < segments.length - 1 && splitBy !== "characters",
		}));
	}, [visibleText, splitBy, splitIntoCharacters]);

	useEffect(() => {
		if (!containerRef.current || !measureRef.current) return;

		const containerWidth = containerRef.current.offsetWidth;
		let currentText = text;
		let didOverflow = false;

		measureRef.current.innerText = currentText;
		while (
			measureRef.current.offsetWidth > containerWidth &&
			currentText.length > 0
		) {
			currentText = currentText.slice(0, -1);
			measureRef.current.innerText = currentText + "…";
			didOverflow = true;
		}
		setVisibleText(didOverflow ? currentText + "…" : text);
	}, [text]);

	return (
		<span
			ref={containerRef}
			className={cn("relative block w-full", className)}
		>
			<span
				ref={measureRef}
				className="absolute invisible whitespace-pre pointer-events-none"
				style={{ whiteSpace: "pre", visibility: "hidden" }}
			/>

			<AnimatePresence mode="sync">
				<motion.div
					key={visibleText}
					layout
					aria-hidden="true"
					className="absolute inset-0 inline-flex flex-nowrap"
				>
					{textChunks.map((chunk, wi) => {
						const offset = textChunks
							.slice(0, wi)
							.reduce((sum, c) => sum + c.parts.length, 0);

						return (
							<span
								key={wi}
								className="inline-flex"
							>
								{chunk.parts.map((char, ci) => (
									<motion.span
										key={ci}
										initial={initial}
										animate={animate}
										exit={exit}
										transition={{
											...transition,
											duration,
											delay:
												(offset + ci) * staggerDuration,
										}}
										className={cn(
											"inline-block whitespace-pre",
											elementClassName,
										)}
									>
										{char}
									</motion.span>
								))}
							</span>
						);
					})}
				</motion.div>
			</AnimatePresence>
		</span>
	);
}
