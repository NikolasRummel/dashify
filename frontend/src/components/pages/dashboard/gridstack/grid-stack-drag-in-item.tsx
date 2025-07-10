"use client";

import { DDDragOpt, GridStack } from "gridstack";
import { useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import { dashboardIsWidgetDrawerOpenState } from "@/atoms/dashboard";
import { BaseWidget } from "@/types/dashboard";

export function GridStackDragInItem({
	children,
	item,
	className,
	dragOptions,
	...props
}: {
	children: React.ReactNode;
	item: BaseWidget;
	className?: string;
	dragOptions?: DDDragOpt;
} & React.HTMLProps<HTMLDivElement>) {
	const panelRef = useRef<HTMLDivElement>(null);
	const setIsWidgetDrawerOpen = useSetAtom(dashboardIsWidgetDrawerOpenState);

	useEffect(() => {
		if (panelRef.current) {
			GridStack.setupDragIn(
				[panelRef.current],
				{
					...dragOptions,
					start: () => {
						setIsWidgetDrawerOpen(false);
					},
					stop: () => {
						setIsWidgetDrawerOpen(true);
					},
				},
				[item],
			);
		}
	}, [dragOptions, item, setIsWidgetDrawerOpen]);

	return (
		<>
			<div
				{...props}
				ref={panelRef}
				className={`grid-stack-drag-in size-full ${className}`}
				data-gs-type={item.type}
				data-gs-config={JSON.stringify(item.config)}
			>
				<div className="grid-stack-item-content size-full">
					{children}
				</div>
			</div>
		</>
	);
}
