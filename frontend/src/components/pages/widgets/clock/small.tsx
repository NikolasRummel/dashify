"use client";

import { useEffect, useRef, useState } from "react";

export default function Clock() {
	const [time, setTime] = useState<string | null>(null);
	const svgRef = useRef<SVGSVGElement | null>(null);

	useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			const newTime = now.toLocaleTimeString("de-DE", {
				hour: "2-digit",
				minute: "2-digit",
			});
			setTime((prev) => (prev !== newTime ? newTime : prev));

			// Highlight the current second
			const second = now.getSeconds();
			if (svgRef.current) {
				const paths = svgRef.current.querySelectorAll("path");
				paths.forEach((path, index) => {
					path.setAttribute(
						"stroke-opacity",
						index <= second ? "0.65" : "0.25",
					);
				});
			}
		};

		updateTime(); // Set immediately after mount

		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative overflow-hidden p-2">
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 118 118"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				ref={svgRef}
				className="stroke-widget-accent"
			>
				<path
					// 1
					d="M58.3496 1V7"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 2
					d="M65.8833 1L65.258 6.9862"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 3
					d="M73.415 1L72.1675 6.94241"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 4
					d="M80.9438 1L79.0801 6.87069"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 5
					d="M88.4683 1L85.9972 6.77076"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 6
					d="M95.9868 1L92.9204 6.64311"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 7
					d="M103.498 1L99.8504 6.48834"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 8
					d="M111 1L106.79 6.30721"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 9
					d="M117 7L111.693 11.2103"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 10
					d="M117 14.5023L111.512 18.1494"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 11
					d="M117 22.0134L111.357 25.0798"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 12
					d="M117 29.5317L111.229 32.0027"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 13
					d="M117 37.0561L111.129 38.9198"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 14
					d="M117 44.585L111.058 45.8325"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 15
					d="M117 52.1168L111.014 52.7421"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 16
					d="M117 59.6501L111 59.6501"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 17
					d="M117 66.8708L111.014 66.2456"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 18
					d="M117 74.415L111.058 73.1675"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 19
					d="M117 81.9439L111.129 80.0802"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 20
					d="M117 89.4683L111.229 86.9973"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 21
					d="M117 96.9866L111.357 93.9202"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 22
					d="M117 104.498L111.512 100.851"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 23
					d="M117 112L111.693 107.79"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 24
					d="M111 117L106.79 111.693"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 25
					d="M103.498 117L99.8504 111.512"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 26
					d="M95.9863 117L92.9198 111.357"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 27
					d="M88.4683 117L85.9972 111.229"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 28
					d="M80.9438 117L79.0801 111.129"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 29
					d="M73.415 117L72.1675 111.058"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 30
					d="M65.8706 117L65.2454 111.014"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 31
					d="M58.6504 117V111"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 32
					d="M51.1167 117L51.742 111.014"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 33
					d="M43.585 117L44.8325 111.058"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 34
					d="M36.0562 117L37.9199 111.129"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 35
					d="M28.5317 117L31.0028 111.229"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 36
					d="M21.0132 117L24.0797 111.357"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 37
					d="M13.5024 117L17.1496 111.512"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 38
					d="M6 117L10.2103 111.693"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 39
					d="M1 112L6.30721 107.79"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 40
					d="M1 104.498L6.48834 100.851"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 41
					d="M1 96.9866L6.64311 93.9202"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 42
					d="M1 89.4683L6.77076 86.9972"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 43
					d="M1 81.9439L6.87069 80.0802"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 44
					d="M1 74.415L6.94241 73.1675"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 45
					d="M1 66.8832L6.98559 66.2579"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 46
					d="M1 59.3498L7 59.3498"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 47
					d="M1 52.1292L6.98559 52.7544"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 48
					d="M1 44.585L6.94241 45.8325"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 49
					d="M1 37.0561L6.87069 38.9198"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 50
					d="M1 29.5317L6.77076 32.0028"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 51
					d="M1 22.0134L6.64311 25.0798"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 52
					d="M1 14.5023L6.48835 18.1494"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 53
					d="M1 7L6.30721 11.2103"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 53
					d="M6 1L10.2103 6.30721"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 54
					d="M13.5024 1L17.1496 6.48834"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 55
					d="M21.0132 1L24.0796 6.64311"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 56
					d="M28.5317 1L31.0028 6.77076"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 57
					d="M36.0562 1L37.9199 6.87069"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 58
					d="M43.585 1L44.8325 6.94241"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
				<path
					// 59
					d="M51.1294 1L51.7547 6.9862"
					strokeWidth="1.71429"
					strokeLinecap="round"
				/>
			</svg>
			<h1 className="font-antonio absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[2.75rem] font-black text-widget-accent">
				{time}
			</h1>
		</div>
	);
}
