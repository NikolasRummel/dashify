import { easeOutQuart } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AnimatedWidgetBackground({
	src,
	alt = "Background",
}: {
	src: string;
	alt?: string;
}) {
	const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
	const [exiting, setExiting] = useState<{ id: string; src: string }[]>([]);

	useEffect(() => {
		if (src && src !== currentSrc) {
			if (currentSrc) {
				setExiting((prev) => [
					...prev,
					{ id: `${currentSrc}-${Date.now()}`, src: currentSrc },
				]);
			}
			setCurrentSrc(src);
		}
	}, [src, currentSrc]);

	return (
		<div className="absolute inset-0 -z-10">
			<AnimatePresence>
				{exiting.map((bg) => (
					<motion.div
						key={bg.id}
						className="absolute inset-0"
						initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
						animate={{
							opacity: 0,
							scale: 1.15,
							filter: "blur(10px) brightness(0)",
						}}
						exit={{ opacity: 0 }}
						transition={{ duration: 1, ease: easeOutQuart }}
						onAnimationComplete={() => {
							setExiting((prev) =>
								prev.filter((item) => item.id !== bg.id),
							);
						}}
						style={{ zIndex: 1 }}
					>
						<Image
							src={bg.src}
							alt={alt}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-cover object-center opacity-80"
							style={{ zIndex: 0 }}
						/>
					</motion.div>
				))}
				{currentSrc && (
					<motion.div
						key={`current-${currentSrc}`}
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
						}}
						transition={{
							duration: exiting.length ? 1 : 3,
							ease: easeOutQuart,
							delay: 0.1,
						}}
						style={{ zIndex: 2 }}
					>
						<Image
							src={currentSrc}
							alt={alt}
							fill
							className="object-cover object-center opacity-80"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							style={{ zIndex: 0 }}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
