"use client";

import Logo from "@/components/ui/logo";

export default function Debug() {
	return (
		<div className="relative flex h-full w-full flex-col items-center justify-center rounded-3xl shadow-md">
			<Logo className="mt-2 ml-1" withFilter={false} />
			<p className="text-primary/40 absolute top-2 right-4 font-mono text-lg font-normal">
				Debug Widget
			</p>
		</div>
	);
}
