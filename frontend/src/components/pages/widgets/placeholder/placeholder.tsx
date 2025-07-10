"use client";

import Logo from "@/components/ui/logo";

export default function Placeholder({
	size,
	type,
}: {
	size: "small" | "medium" | "large";
	type: string;
}) {
	return (
		<div
			className={
				`relative flex h-full w-full flex-col items-center justify-center rounded-3xl` +
				(size === "medium" && `aspect-[2/1]`)
			}
		>
			<Logo className="mt-2 ml-1" withFilter={false} />
			<p className="text-primary/40 text-md text-center font-mono font-normal">
				{type} Widget
			</p>
		</div>
	);
}
