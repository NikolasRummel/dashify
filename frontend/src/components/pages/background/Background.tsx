"use client";

import { dashboardBackgroundState } from "@/atoms/dashboard";
import { easeOutQuart } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export default function Background({
	children,
}: {
	children: React.ReactNode;
}) {
	const background = useAtomValue(dashboardBackgroundState);
	const [currentBackground, setCurrentBackground] = useState<
		string | undefined
	>();
	const [previousBackground, setPreviousBackground] = useState<
		string | undefined
	>();

	useEffect(() => {
		if (background !== currentBackground) {
			setPreviousBackground(currentBackground);
			setCurrentBackground(background);
		}
	}, [background, currentBackground]);

	return (
		<div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
			<AnimatePresence mode="sync">
				{previousBackground && (
					<motion.div
						key={`previous-${previousBackground}`}
						className="absolute inset-0"
						initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
						animate={{
							opacity: 0,
							scale: 1.15,
							filter: "blur(10px) brightness(0.7)",
							zIndex: 1,
						}}
						exit={{ opacity: 0 }}
						transition={{ duration: 1, ease: "easeInOut" }}
						onAnimationComplete={() =>
							setPreviousBackground(undefined)
						}
						style={{
							backgroundImage: `url('${previousBackground}')`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
						}}
					/>
				)}

				<motion.div
					key={`current-${currentBackground}`}
					className="absolute inset-0"
					initial={{
						opacity: 0,
						scale: 1.15,
						filter: "blur(16px)",
					}}
					animate={{
						opacity: 1,
						scale: 1,
						filter: "blur(0px)",
						zIndex: 2,
					}}
					transition={{
						duration: previousBackground ? 1 : 3,
						ease: easeOutQuart,
						delay: 0.1,
					}}
					style={{
						backgroundImage: `url('${currentBackground}')`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
				/>
			</AnimatePresence>

			<div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
				{children}
			</div>
		</div>
	);
}
