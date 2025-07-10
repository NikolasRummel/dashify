"use client";

import {
	allListsAtom,
	searchQueryAtom,
	searchResultsAtom,
	selectedListAtom,
} from "@/atoms/lists";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { addListItem, deleteListItem, updateListItem } from "@/lib/api/list";
import { List, ListItem } from "@/types/list";
import { format } from "date-fns";
import { useAtom, useSetAtom } from "jotai";
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import EditListItemDialog from "./EditListItemDialog";

export default function ListContent() {
	const [searchResults] = useAtom(searchResultsAtom);
	const [searchQuery] = useAtom(searchQueryAtom);
	const [selectedList] = useAtom(selectedListAtom);
	const setAllLists = useSetAtom(allListsAtom);
	const setSelectedList = useSetAtom(selectedListAtom);
	const [editingItem, setEditingItem] = useState<ListItem | null>(null);
	const [newItemText, setNewItemText] = useState("");

	const updateListsAndSelection = (updater: (lists: List[]) => List[]) => {
		setAllLists((prev) => {
			const updated = updater(prev);
			// Update selectedList if one is selected
			if (selectedList) {
				const updatedSelectedList = updated.find(
					(l) => l.id === selectedList.id,
				);
				if (updatedSelectedList) {
					setSelectedList(updatedSelectedList);
				}
			}
			return updated;
		});
	};

	const handleCheckboxChange = async (
		itemId: number,
		currentDone: boolean,
	) => {
		// Optimistic update
		updateListsAndSelection((lists) =>
			lists.map((list) => ({
				...list,
				items: list.items.map((item) =>
					item.id === itemId ? { ...item, done: !currentDone } : item,
				),
			})),
		);

		try {
			// Get the item to update
			const item = searchResults
				.flatMap((list) => list.items)
				.find((item) => item.id === itemId);

			if (item) {
				await updateListItem({
					...item,
					done: !currentDone,
				});
			}
		} catch (error) {
			console.error("Failed to update item:", error);
			// Revert on error
			updateListsAndSelection((lists) =>
				lists.map((list) => ({
					...list,
					items: list.items.map((item) =>
						item.id === itemId
							? { ...item, done: currentDone }
							: item,
					),
				})),
			);
		}
	};

	const handleDeleteItem = async (itemId: number) => {
		try {
			await deleteListItem(itemId);
			updateListsAndSelection((lists) =>
				lists.map((list) => ({
					...list,
					items: list.items.filter((item) => item.id !== itemId),
				})),
			);
		} catch (error) {
			console.error("Failed to delete item:", error);
		}
	};

	const handleAddItem = async () => {
		if (!newItemText.trim() || !selectedList?.id) return;

		const itemData = {
			text: newItemText.trim(),
			done: false,
			list_id: selectedList.id,
			deadline: "",
		};

		try {
			const createdItem = await addListItem(itemData);
			updateListsAndSelection((lists) =>
				lists.map((list) =>
					list.id === selectedList.id
						? { ...list, items: [...list.items, createdItem] }
						: list,
				),
			);
			setNewItemText("");
		} catch (error) {
			console.error("Failed to add item:", error);
		}
	};

	const renderHighlightedText = (text: string) => {
		if (!searchQuery.trim()) return text;

		const lowerQuery = searchQuery.trim().toLowerCase();
		const matchIdx = text.toLowerCase().indexOf(lowerQuery);

		if (matchIdx === -1) return text;

		return (
			<>
				{matchIdx > 0 && text.substring(0, matchIdx)}
				<span className="bg-yellow-200/60 rounded px-0.5 align-baseline box-decoration-clone">
					{text.substring(matchIdx, matchIdx + lowerQuery.length)}
				</span>
				{matchIdx + lowerQuery.length < text.length &&
					text.substring(matchIdx + lowerQuery.length)}
			</>
		);
	};

	if (searchResults.length === 0) {
		return (
			<div className="w-full flex-1 flex items-center justify-center text-lg text-muted-foreground">
				No items found.
			</div>
		);
	}

	return (
		<div className="w-full h-full flex text-foreground">
			<div className="flex flex-col flex-1 space-y-6">
				{searchResults.map((list) => (
					<div
						key={`list-${list.id}`}
						className="space-y-2"
					>
						<h3 className="font-semibold text-foreground px-2 text-lg">
							{list.name}
						</h3>

						{list.items.map((item, idx) => (
							<div key={`item-${item.id}`}>
								<div className="flex items-center gap-3 p-1.5 rounded-lg group">
									<Checkbox
										variant="circle"
										className="bg-primary/10 border-primary/20"
										checked={item.done}
										onCheckedChange={() =>
											handleCheckboxChange(
												item.id,
												item.done,
											)
										}
									/>
									<div className="flex flex-col w-full">
										<div className="font-normal line-clamp-1 text-ellipsis flex-1 text-sm">
											{renderHighlightedText(
												item.text || "",
											)}
										</div>
										{item.deadline && (
											<div
												className={`flex items-center gap-1 text-xs ${
													new Date(
														item.deadline,
													).toDateString() ===
													new Date().toDateString()
														? "text-yellow-500"
														: new Date(
																	item.deadline,
															  ) < new Date()
															? "text-destructive"
															: "text-muted-foreground"
												}`}
											>
												{format(
													new Date(item.deadline),
													"dd.MM.yyyy",
												)}
											</div>
										)}
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="noHover"
												size="icon"
												className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
											>
												<MoreHorizontalIcon className="h-3 w-3" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() =>
													setEditingItem(item)
												}
											>
												<PencilIcon className="h-3 w-3 mr-1" />
												<span>Edit</span>
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-red-500"
												onClick={() =>
													handleDeleteItem(item.id)
												}
											>
												<TrashIcon className="h-3 w-3 mr-1" />
												<span>Delete</span>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
								{idx < list.items.length - 1 && (
									<Separator className="my-0 bg-primary/10" />
								)}
							</div>
						))}

						{selectedList && searchQuery.trim() === "" && (
							<div className="flex items-center gap-2 p-1.5 rounded-lg mt-2">
								<span className="w-4 h-4" />
								<input
									type="text"
									value={newItemText}
									onChange={(e) =>
										setNewItemText(e.target.value)
									}
									placeholder="Add new item..."
									className="flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleAddItem();
										}
									}}
								/>
							</div>
						)}
					</div>
				))}
			</div>

			{editingItem && (
				<EditListItemDialog
					item={editingItem}
					open={!!editingItem}
					onOpenChange={(open: boolean) =>
						!open && setEditingItem(null)
					}
					onItemUpdated={(updatedItem: ListItem) => {
						updateListsAndSelection((lists) =>
							lists.map((list) => ({
								...list,
								items: list.items.map((item) =>
									item.id === updatedItem.id
										? updatedItem
										: item,
								),
							})),
						);
					}}
				/>
			)}
		</div>
	);
}
