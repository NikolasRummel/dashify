import { dashboardIsEditingState } from "@/atoms/dashboard";
import ItemEntryWrapper from "@/components/wrappers/motion/entry-wrapper";
import { WidgetType } from "@/types/dashboard";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { widgetCategories } from ".";
import { WidgetSizeNotSupportedError } from "./errors/size-not-supported";

export default function WidgetContent({ widget }: { widget: WidgetType }) {
	const isEditing = useAtomValue(dashboardIsEditingState);

	// Find widget from list of all widgets
	const foundWidgetCategory = widgetCategories.find(
		(category) => category.type === widget.type,
	);

	if (!foundWidgetCategory) {
		return <div>Widget category not found: {widget.type}</div>;
	}

	const foundWidget = foundWidgetCategory.widgets.find(
		(w) => w.w === widget.w && w.h === widget.h,
	);

	const content = foundWidget?.component ? (
		foundWidget.component
	) : (
		<WidgetSizeNotSupportedError
			category={foundWidgetCategory}
			widget={widget}
		/>
	);

	return (
		<WidgetResponsiveWrapper widget={widget}>
			{(scale) => (
				<ItemEntryWrapper
					className="widget text-primary flex size-full flex-col items-center justify-center overflow-hidden rounded-3xl font-bold select-none"
					variants={{
						hidden: {
							opacity: 0,
						},
						visible: {
							opacity: 1,
						},
					}}
					delay={isEditing ? 0 : 0.3}
					duration={isEditing ? 0.2 : 0.8}
					ease={"easeInOut"}
					style={{
						width: widget.w * 128 + "px",
						height: widget.h * 128 + "px",
						transform: `scale(${scale.x}, ${scale.y})`,
						transformOrigin: "0 0",
					}}
				>
					{content}
				</ItemEntryWrapper>
			)}
		</WidgetResponsiveWrapper>
	);
}

export function WidgetResponsiveWrapper({
	widget,
	children,
}: {
	widget: WidgetType;
	children: (scale: { x: number; y: number }) => React.ReactNode;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState({ x: 1, y: 1 });

	useEffect(() => {
		if (!containerRef.current) return;
		const naturalWidth = widget.w * 128;
		const naturalHeight = widget.h * 128;

		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				setScale({
					x: width / naturalWidth,
					y: height / naturalHeight,
				});
			}
		});

		ro.observe(containerRef.current);
		return () => ro.disconnect();
	}, [widget.w, widget.h]);

	return (
		<div
			ref={containerRef}
			className="w-full h-full relative overflow-visible"
		>
			{children(scale)}
		</div>
	);
}
