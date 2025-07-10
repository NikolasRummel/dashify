import { createPortal } from "react-dom";
import { useGridContext } from "@/components/pages/dashboard/gridstack/grid-context-provider";
import WidgetContent from "@/components/pages/widgets/WidgetContent";
import { WidgetType } from "@/types/dashboard";
import { FiMinus } from "react-icons/fi";
import DragHandle from "@/components/ui/drag-handle";
import { useAtomValue } from "jotai";
import { dashboardIsEditingState } from "@/atoms/dashboard";
import { useEffect, useState } from "react";

export function GridStackItem({ widget }: { widget: WidgetType }) {
	const { widgetContainers, setItems } = useGridContext();
	const widgetContainer = widgetContainers?.get(widget.id) || null;
	const isEditing = useAtomValue(dashboardIsEditingState);
	const [animationDuration, setAnimationDuration] = useState(0);

	useEffect(() => {
		setAnimationDuration(Math.random() * 0.2 + 0.2);
	}, [isEditing]);

	if (!widgetContainer) {
		return null;
	}

	function handleDelete() {
		setItems((prevItems) =>
			prevItems.filter((item) => item.id !== widget.id),
		);
		widgetContainer?.remove();
	}

	const content = (
		<div
			className={`size-full ${isEditing && "animate-wiggle"}`}
			style={{
				animationDuration: `${animationDuration}s`,
			}}
		>
			<WidgetContent widget={widget} />
			<button
				onClick={handleDelete}
				className={`absolute -top-2 -left-2 flex size-8 cursor-pointer flex-row items-center justify-center rounded-full bg-white/70 text-center saturate-200 backdrop-blur-md transition-all duration-100 ${isEditing ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
			>
				<FiMinus size={22} className="text-neutral-700" />
			</button>
			<div
				className={`absolute -right-1 -bottom-1 z-50 flex size-7 flex-row items-center justify-center text-white transition-all duration-100 ${isEditing ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
			>
				<DragHandle />
			</div>
		</div>
	);

	return createPortal(content, widgetContainer);
}
