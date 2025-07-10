import { cubicBezier } from "motion";

/**
 * Custom easing function for smooth deceleration.
 * Creates a quartic ease-out curve.
 */
export const easeOutQuart = cubicBezier(0.25, 1, 0.5, 1);

/**
 * Custom easing function for bouncy animations.
 * Creates a bounce-like ease-out curve.
 */
export const easeOutBounce = cubicBezier(0.25, 1, 0.49, 1.02);

/**
 * Animation configuration for elements fading in from above.
 * Used for large elements that need to slide down while fading in.
 */
export const fadeInFromTopLg = {
	hidden: { opacity: 0, y: -50 },
	visible: { opacity: 1, y: 0 },
};
