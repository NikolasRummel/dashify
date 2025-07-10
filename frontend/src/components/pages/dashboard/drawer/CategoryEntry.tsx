import { dashboardWidgetDrawerCategoryState } from "@/atoms/dashboard";
import { Button } from "@/components/ui/button";
import { WidgetCategory } from "@/types/dashboard";
import { useSetAtom } from "jotai";

export default function CategoryEntry({
	category,
}: {
	category: WidgetCategory;
}) {
	const setSelectedCategory = useSetAtom(dashboardWidgetDrawerCategoryState);

	return (
		<Button
			key={category.title}
			variant="ghost"
			className="group hover:bg-primary/5 w-full justify-start gap-2 rounded-lg px-2"
			onClick={() => setSelectedCategory(category)}
		>
			<div
				className="flex size-7 flex-col items-center justify-center rounded-sm text-white shadow-md"
				style={{
					background: category.color,
				}}
			>
				{category.icon}
			</div>
			{category.title}
		</Button>
	);
}
