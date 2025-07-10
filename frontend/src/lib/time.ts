/**
 * Formats a cooking time in minutes into a human-readable string.
 * @param minutes - The cooking time in minutes
 * @returns A formatted string like "2h 30m" or "45m"
 * @example
 * formatCookingTime(150) // returns "2h 30m"
 * formatCookingTime(45) // returns "45m"
 * formatCookingTime(0) // returns "0m"
 */
export function formatCookingTime(minutes: number) {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return (
		[h > 0 ? `${h}h` : null, m > 0 ? `${m}m` : null]
			.filter(Boolean)
			.join(" ") || "0m"
	);
}

/**
 * Creates a debounced version of a function that delays its execution
 * until after a specified wait time has elapsed since the last time it was invoked.
 * @template T - The type of the function to debounce
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @returns A debounced version of the input function
 * @example
 * const debouncedSearch = debounce((query) => searchAPI(query), 300);
 * // Will only execute after 300ms of no calls
 */
export function debounce<T extends (...args: any[]) => void>(
	func: T,
	delay: number,
) {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
}
