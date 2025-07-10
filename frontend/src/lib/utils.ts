import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names with Tailwind CSS classes.
 * Combines clsx and tailwind-merge to handle class name conflicts.
 * @param inputs - Class names to be merged
 * @returns A string of merged class names
 * @example
 * cn("px-2 py-1", "bg-red-500", { "text-white": true }) // "px-2 py-1 bg-red-500 text-white"
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
