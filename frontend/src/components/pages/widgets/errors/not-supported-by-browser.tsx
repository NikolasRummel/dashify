import { FaHeartBroken } from "react-icons/fa";

export function NotSupportedByBrowserError() {
	return (
		<div className="flex size-full flex-col items-center justify-center gap-2 text-center">
			<FaHeartBroken className="text-4xl text-black/50 saturate-200 dark:text-white/80" />
			<div>
				<h1 className="text-md text-black/70 dark:text-white/70">
					Not supported
				</h1>
				<p className="text-xs font-normal text-balance text-black/50 dark:text-white/50">
					Widget not supported by your browser.
				</p>
			</div>
		</div>
	);
}
