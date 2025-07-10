"use client";

import {
	allListsAtom,
	filteredListsAtom,
	filterModeAtom,
	selectedListAtom,
	statsAtom,
} from "@/atoms/lists";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteList } from "@/lib/api/list";
import { cn } from "@/lib/utils";
import { List } from "@/types/list";
import { useAtom, useSetAtom } from "jotai";
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import * as Icons from "react-icons/fa6";
import EditListDialog from "./EditListDialog";

export default function ListSidebar() {
	const [filteredLists] = useAtom(filteredListsAtom);
	const [selectedList, setSelectedList] = useAtom(selectedListAtom);
	const [filterMode, setFilterMode] = useAtom(filterModeAtom);
	const setAllLists = useSetAtom(allListsAtom);
	const stats = useAtom(statsAtom)[0];
	const [editingList, setEditingList] = useState<List | null>(null);

	const filters = [
		{
			label: "All items",
			count: stats.total,
			icon: "FaList",
		},
		{
			label: "Scheduled",
			count: stats.scheduled,
			icon: "FaCalendar",
		},
		{
			label: "Completed",
			count: stats.completed,
			icon: "FaCheck",
		},
		{
			label: "Uncompleted",
			count: stats.uncompleted,
			icon: "FaClock",
		},
	];

	const handleListClick = (list: List) => {
		setSelectedList(list);
		setFilterMode(null);
	};

	const handleFilterClick = (filterLabel: string) => {
		setFilterMode(filterLabel);
		setSelectedList(null);
	};

	const handleDeleteList = async (listId: number) => {
		try {
			await deleteList(listId);
			setAllLists((prev) => prev.filter((list) => list.id !== listId));
			if (selectedList?.id === listId) {
				setSelectedList(null);
			}
		} catch (error) {
			console.error("Failed to delete list:", error);
		}
	};

	return (
		<div className="text-foreground">
			<div className="grid grid-cols-2 gap-3 mb-6 mt-4">
				{filters.map((filterOption) => (
					<button
						key={filterOption.label}
						className={cn(
							"bg-primary/10 rounded-lg p-4 flex flex-col items-start justify-between transition-all hover:bg-primary/20 min-h-28",
							filterMode === filterOption.label &&
								"bg-primary/20 ring-2 ring-inset ring-primary/30",
						)}
						onClick={() => handleFilterClick(filterOption.label)}
					>
						<div className="flex items-start justify-between w-full">
							<span className="bg-primary/10 rounded-full p-2">
								{Icons[
									filterOption.icon as keyof typeof Icons
								] &&
									React.createElement(
										Icons[
											filterOption.icon as keyof typeof Icons
										],
										{ className: "h-4 w-4" },
									)}
							</span>
							<span className="text-sm font-semibold">
								{filterOption.count}
							</span>
						</div>
						<span className="text-muted-foreground">
							{filterOption.label}
						</span>
					</button>
				))}
			</div>

			<div className="space-y-2">
				<div className="flex items-center justify-between mb-2 ml-4">
					<p className="uppercase text-sm text-muted-foreground">
						Lists
					</p>
				</div>
				{filteredLists.map((list: List) => {
					const Icon =
						Icons[list.icon as keyof typeof Icons] || Icons.FaList;
					return (
						<div
							key={list.id}
							className={cn(
								"group flex items-center justify-between rounded-lg",
								selectedList?.id === list.id && "bg-popover/20",
							)}
						>
							<Button
								variant="noHover"
								className="w-full justify-start gap-2"
								onClick={() => handleListClick(list)}
							>
								<Icon className="h-4 w-4" />
								<div className="flex items-center justify-between w-full">
									{list.name}
								</div>
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger
									asChild
									className="w-8 h-8"
								>
									<Button
										variant="noHover"
										size="icon"
										className="opacity-0 group-hover:opacity-100 transition-opacity aspect-square mr-1 cursor-pointer"
									>
										<MoreHorizontalIcon className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => setEditingList(list)}
									>
										<PencilIcon className="h-4 w-4 mr-1" />
										<span>Edit</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-red-500"
										onClick={() =>
											handleDeleteList(list.id)
										}
									>
										<Trash2Icon className="h-4 w-4 mr-1" />
										<span>Delete</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
							<span className="text-xs text-muted-foreground mx-4">
								{list.items.length}
							</span>
						</div>
					);
				})}
			</div>

			{editingList && (
				<EditListDialog
					list={editingList}
					open={!!editingList}
					onOpenChange={(open: boolean) =>
						!open && setEditingList(null)
					}
				/>
			)}
		</div>
	);
}
