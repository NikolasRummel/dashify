import {
	dashboardIsEditingState,
	dashboardIsWidgetDrawerOpenState,
} from "@/atoms/dashboard";
import { Button } from "@/components/ui/button";
import { useAtom, useAtomValue } from "jotai";
import React from "react";
import { IoAdd } from "react-icons/io5";

export default function AddWidgetButton() {
	const isEditing = useAtomValue(dashboardIsEditingState);
	const [isDrawerOpen, setIsDrawerOpen] = useAtom(
		dashboardIsWidgetDrawerOpenState,
	);

	return (
		<Button
			size="chip"
			variant="widget"
			onClick={() => setIsDrawerOpen(true)}
			className={`group absolute right-3 bottom-3 flex w-8 flex-row items-center justify-center gap-2 overflow-clip transition-all duration-500 hover:w-28 ${
				isEditing && !isDrawerOpen
					? "translate-y-0 opacity-100"
					: "translate-y-10 opacity-0"
			} `}
		>
			<div className="absolute right-7 w-fit translate-x-10 transform text-xs font-semibold text-nowrap opacity-0 blur-sm transition-all duration-300 select-none group-hover:block group-hover:translate-x-0 group-hover:opacity-100 group-hover:blur-none">
				Add Widgets
			</div>
			<div className="absolute right-2">
				<IoAdd size={16} />
			</div>
		</Button>
	);
}
