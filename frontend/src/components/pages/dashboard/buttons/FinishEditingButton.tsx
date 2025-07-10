import {
	dashboardIsEditingState,
	dashboardIsWidgetDrawerOpenState,
} from "@/atoms/dashboard";
import { Button } from "@/components/ui/button";
import { useAtom, useAtomValue } from "jotai";
import { IoCheckmark } from "react-icons/io5";

export default function FinishEditingButton() {
	const [isEditing, setIsEditing] = useAtom(dashboardIsEditingState);
	const isDrawerOpen = useAtomValue(dashboardIsWidgetDrawerOpenState);

	return (
		<Button
			size="chip"
			variant="widget"
			onClick={() => {
				setIsEditing(false);
			}}
			className={`absolute bottom-3 left-1/2 flex -translate-x-1/2 flex-row items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-500 select-none ${
				isEditing && !isDrawerOpen
					? "translate-y-0 opacity-100"
					: "translate-y-10 opacity-0"
			}`}
		>
			<IoCheckmark size={16} />
			Finish Editing and Save
		</Button>
	);
}
