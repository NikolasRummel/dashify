import * as React from "react";

/**
 * Breakpoint width in pixels that determines mobile vs desktop view.
 * Devices with width less than this value are considered mobile.
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Hook for detecting if the current viewport is mobile-sized.
 * Uses window.matchMedia to track viewport width changes.
 *
 * @returns A boolean indicating if the current viewport is mobile-sized
 *
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) {
 *   // Render mobile layout
 * } else {
 *   // Render desktop layout
 * }
 */
export default function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
		undefined,
	);

	React.useEffect(() => {
		const mql = window.matchMedia(
			`(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
		);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isMobile;
}
