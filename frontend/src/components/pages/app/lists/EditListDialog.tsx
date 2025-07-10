"use client";

import { allListsAtom } from "@/atoms/lists";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { updateList } from "@/lib/api/list";
import { List } from "@/types/list";
import { useSetAtom } from "jotai";
import { useState } from "react";
import {
	FaBookmark,
	FaCalendar,
	FaCheck,
	FaClipboard,
	FaClipboardList,
	FaFlag,
	FaFolder,
	FaList,
	FaStar,
	FaTag,
} from "react-icons/fa6";

const TODO_ICON_OPTIONS = [
	{ value: "FaList", label: "List", icon: FaList },
	{ value: "FaCheck", label: "Check", icon: FaCheck },
	{ value: "FaClipboard", label: "Clipboard", icon: FaClipboard },
	{ value: "FaClipboardList", label: "Tasks", icon: FaClipboardList },
	{ value: "FaCalendar", label: "Calendar", icon: FaCalendar },
	{ value: "FaStar", label: "Star", icon: FaStar },
	{ value: "FaBookmark", label: "Bookmark", icon: FaBookmark },
	{ value: "FaFlag", label: "Flag", icon: FaFlag },
	{ value: "FaTag", label: "Tag", icon: FaTag },
	{ value: "FaFolder", label: "Folder", icon: FaFolder },
];

interface EditListDialogProps {
	list: List;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function EditListDialog({
	list,
	open,
	onOpenChange,
}: EditListDialogProps) {
	const [name, setName] = useState(list.name);
	const [loading, setLoading] = useState(false);
	const setAllLists = useSetAtom(allListsAtom);

	const [icon, setIcon] = useState(list.icon);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		setLoading(true);
		try {
			const updatedListData = {
				...list,
				name: name.trim(),
				icon: list.type === "SHOPPING" ? "FaCartShopping" : icon,
			};
			const updatedList = await updateList(list.id, updatedListData);
			if (!updatedList) {
				throw new Error(
					"Failed to update list: No response from server",
				);
			}
			// Update the atom with our local data to ensure all fields are updated immediately
			setAllLists((prev) =>
				prev.map((l) =>
					l.id === list.id ? { ...l, ...updatedListData } : l,
				),
			);
			onOpenChange(false);
		} catch (error) {
			console.error("Failed to update list:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-w-md w-full p-6 rounded-2xl">
				<DialogHeader>
					<DialogTitle className="text-xl mb-2">
						Edit {list.type === "TODO" ? "Todo" : "Shopping"} List
					</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={handleSubmit}
					className="space-y-6"
				>
					{list.type === "TODO" && (
						<div className="space-y-2">
							<label className="block text-xs font-medium text-muted-foreground mb-1">
								Icon
							</label>
							<Select
								value={icon}
								onValueChange={setIcon}
								disabled={loading}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select an icon">
										{(() => {
											const selectedOption =
												TODO_ICON_OPTIONS.find(
													(option) =>
														option.value === icon,
												);
											if (selectedOption) {
												return (
													<div className="flex items-center gap-2">
														<selectedOption.icon className="w-4 h-4" />
														{selectedOption.label}
													</div>
												);
											}
											return "Select an icon";
										})()}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{TODO_ICON_OPTIONS.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											<div className="flex items-center gap-2">
												<option.icon className="w-4 h-4" />
												{option.label}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
					<div className="space-y-2">
						<label className="block text-xs font-medium text-muted-foreground mb-1">
							List Name
						</label>
						<Input
							placeholder="List name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={loading}
						/>
					</div>
					<div className="flex justify-end pt-2">
						<Button
							type="submit"
							disabled={loading || !name.trim()}
							className="w-full"
						>
							{loading ? "Saving..." : "Save"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
