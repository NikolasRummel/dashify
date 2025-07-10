import React, { useEffect, useRef, useState } from "react";

interface DissolveEffectProps {
	animating: boolean;
	children: React.ReactNode;
}

const DissolveEffect: React.FC<DissolveEffectProps> = ({
	animating,
	children,
}) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const prevAnimatingRef = useRef<boolean>(false);

	const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
	const maxDisplacementScale = 2000;

	useEffect(() => {
		const displacementMap = document
			.getElementById("dissolve-filter")
			?.querySelector("feDisplacementMap");

		displacementMap?.setAttribute("scale", "0");
		if (contentRef.current) {
			contentRef.current.style.opacity = "1";
			contentRef.current.style.display = "";
		}

		if (animating && !prevAnimatingRef.current && !isAnimating) {
			setIsAnimating(true);
			startAnimation();
		}

		prevAnimatingRef.current = animating;
	}, [animating, isAnimating]);

	const startAnimation = () => {
		setRandomSeed();

		const duration = 1000;
		const startTime = performance.now();

		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = easeOutCubic(progress);

			const displacementMap = document
				.getElementById("dissolve-filter")
				?.querySelector("feDisplacementMap");

			const displacementScale = easedProgress * maxDisplacementScale;

			displacementMap?.setAttribute(
				"scale",
				displacementScale.toString(),
			);

			if (contentRef.current) {
				const scaleFactor = 1 + 0.1 * easedProgress;
				contentRef.current.style.transform = `scale(${scaleFactor})`;

				let opacity;
				if (progress < 0.5) {
					opacity = 0.4;
				} else {
					const opacityProgress = (progress - 0.5) / 0.5;
					opacity = 0.4 - opacityProgress;
				}
				contentRef.current.style.opacity = opacity.toString();
			}

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setIsAnimating(false);
			}
		};

		requestAnimationFrame(animate);
	};

	const setRandomSeed = () => {
		const randomSeed = Math.floor(Math.random() * 1000);
		const bigNoise = document.querySelector(
			'feTurbulence[result="bigNoise"]',
		);
		bigNoise?.setAttribute("seed", randomSeed.toString());
	};

	return (
		<div style={{ width: "100%", height: "100%", display: "flex" }}>
			<svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
				<defs>
					<filter
						id="dissolve-filter"
						x="-200%"
						y="-200%"
						width="1000%"
						height="1000%"
						colorInterpolationFilters="sRGB"
						overflow="visible"
					>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.004"
							numOctaves="1"
							result="bigNoise"
						/>
						<feComponentTransfer
							in="bigNoise"
							result="bigNoiseAdjusted"
						>
							<feFuncR type="linear" slope="3" intercept="-1" />
							<feFuncG type="linear" slope="3" intercept="-1" />
						</feComponentTransfer>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="1"
							numOctaves="1"
							result="fineNoise"
						/>
						<feMerge result="mergedNoise">
							<feMergeNode in="bigNoiseAdjusted" />
							<feMergeNode in="fineNoise" />
						</feMerge>
						<feDisplacementMap
							in="SourceGraphic"
							in2="mergedNoise"
							scale="0"
							xChannelSelector="R"
							yChannelSelector="G"
						/>
					</filter>
				</defs>
			</svg>
			<div
				ref={contentRef}
				style={{
					filter: animating ? "url(#dissolve-filter)" : "none",
					width: "100%",
					height: "100%",
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default DissolveEffect;
