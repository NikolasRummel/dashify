import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { dashboardWidgetDrawerCategoryState } from "@/atoms/dashboard";
import { widgetCategories } from "../../widgets";
import { GridStackDragInItem } from "@/components/pages/dashboard/gridstack/grid-stack-drag-in-item";

export default function WidgetList() {
	const selectedCategory = useAtomValue(dashboardWidgetDrawerCategoryState); // Get the selected category
	const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({}); // Store refs for each category

	// Scroll to the selected category when it changes
	useEffect(() => {
		if (selectedCategory) {
			// Scroll to the first category if "all-widgets" is selected
			if (selectedCategory.type === "all-widgets") {
				categoryRefs.current[widgetCategories[0].type]?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			} else if (categoryRefs.current[selectedCategory.type]) {
				// Scroll to the selected category
				categoryRefs.current[selectedCategory.type]?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		}
	}, [selectedCategory]);

	return (
		<ScrollArea className="flex w-full flex-col overflow-visible rounded-r-lg px-6">
			{widgetCategories.map((category) => (
				<div
					key={category.title}
					ref={(el) => {
						categoryRefs.current[category.type] = el;
					}}
					className="flex flex-col gap-4 pt-5"
				>
					<div className="text-md font-semibold">
						{category.title}
					</div>
					<div className="mb-6 grid flex-wrap gap-x-4 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
						{category.widgets.map((widget, id) => {
							return (
								<div
									key={id}
									className="flex flex-col items-center justify-between gap-6"
								>
									<div className="flex h-full w-full items-center justify-center">
										<GridStackDragInItem
											item={{
												...widget,
												type: category.type,
												config: {}, // TODO: Default config for widgets
											}}
											style={{
												width: `${widget.w * 160}px`,
												height: `${widget.h * 160}px`,
											}}
											className={`overflow-clip rounded-3xl bg-neutral-600/30 shadow-xl backdrop-blur-xl`}
										>
											{widget.component}
										</GridStackDragInItem>
									</div>
									<div className="flex flex-col items-center gap-2">
										<div className="font-semibold">
											{widget.title}
										</div>
										<div className="text-muted-foreground text-center text-sm">
											{widget.description}
										</div>
									</div>
								</div>
							);
						})}
					</div>
					{category.title !==
						widgetCategories[widgetCategories.length - 1].title && (
						<Separator />
					)}
				</div>
			))}
		</ScrollArea>
	);
}
