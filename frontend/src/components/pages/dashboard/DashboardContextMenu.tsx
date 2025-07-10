"use client";

import {
	dashboardIsEditingState,
	dashboardIsWidgetDrawerOpenState,
} from "@/atoms/dashboard";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useAtom, useSetAtom } from "jotai";
import { AiFillEdit } from "react-icons/ai";
import { FaCheck, FaPlus } from "react-icons/fa6";

export default function DashboardContextMenu({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isEditing, setIsEditing] = useAtom(dashboardIsEditingState);
	const setOpenDrawer = useSetAtom(dashboardIsWidgetDrawerOpenState);

	function finishEditing() {
		setIsEditing(false);
	}

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger
					onDoubleClick={finishEditing}
					className="text-primary flex h-fit w-full flex-col justify-center"
				>
					{children}
				</ContextMenuTrigger>
				<ContextMenuContent>
					{isEditing && (
						<ContextMenuItem onClick={() => setOpenDrawer(true)}>
							<FaPlus
								size={16}
								className="mr-1.5"
							/>
							Add Widgets
						</ContextMenuItem>
					)}
					{!isEditing && (
						<ContextMenuItem
							onClick={() => setIsEditing(!isEditing)}
						>
							<AiFillEdit
								size={16}
								className="mr-1.5"
							/>
							Edit Dashboard
						</ContextMenuItem>
					)}
					{isEditing && (
						<>
							<ContextMenuItem
								onClick={() => setIsEditing(!isEditing)}
							>
								<FaCheck
									size={16}
									className="mr-1.5"
								/>
								Finish Editing and Save
							</ContextMenuItem>
						</>
					)}
				</ContextMenuContent>
			</ContextMenu>
		</>
	);
}
