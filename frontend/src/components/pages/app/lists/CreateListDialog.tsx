"use client";

import { activeListTypeAtom, allListsAtom, ListType } from "@/atoms/lists";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createList } from "@/lib/api/list";
import { useSetAtom } from "jotai";
import { PlusIcon } from "lucide-react";
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

const LIST_TYPE_OPTIONS = [
	{ value: "Todo", label: "Todo List" },
	{ value: "Shopping", label: "Shopping List" },
];

interface CreateListDialogProps {
	onListCreated: () => void;
	type: ListType;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function CreateListDialog({
	onListCreated,
	type: initialType,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
}: CreateListDialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const open =
		controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
	const setOpen =
		controlledOnOpenChange !== undefined
			? controlledOnOpenChange
			: setUncontrolledOpen;
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const setAllLists = useSetAtom(allListsAtom);
	const setActiveType = useSetAtom(activeListTypeAtom);

	// Allow user to choose type
	const [type, setType] = useState<ListType>(initialType || "Todo");
	const [icon, setIcon] = useState(
		type === "Shopping" ? "FaCartShopping" : TODO_ICON_OPTIONS[0].value,
	);

	// When type changes, reset icon if needed
	const handleTypeChange = (val: ListType) => {
		setType(val);
		if (val === "Shopping") {
			setIcon("FaCartShopping");
		} else {
			setIcon(TODO_ICON_OPTIONS[0].value);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		setLoading(true);
		try {
			const newList = await createList({
				name: name.trim(),
				type: type.toUpperCase(),
				icon: type === "Shopping" ? "FaCartShopping" : icon,
			});
			if (!newList) {
				throw new Error(
					"Failed to create list: No response from server",
				);
			}
			setAllLists((prev) => [...prev, newList]);
			setName("");
			setOpen(false);
			onListCreated();
			// Switch tab if needed
			if (type !== initialType) {
				setActiveType(type);
			}
		} catch (error) {
			console.error("Failed to create list:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			{controlledOpen === undefined && (
				<DialogTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
					>
						<PlusIcon className="h-4 w-4" />
					</Button>
				</DialogTrigger>
			)}
			<DialogContent className="max-w-md w-full p-6 rounded-2xl">
				<DialogHeader>
					<DialogTitle className="text-xl mb-2">
						Create New List
					</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={handleSubmit}
					className="space-y-6"
				>
					<div className="flex gap-4">
						<div className="flex-1 space-y-2">
							<label className="block text-xs font-medium text-muted-foreground mb-1">
								List Type
							</label>
							<Select
								value={type}
								onValueChange={handleTypeChange}
								disabled={loading}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select list type" />
								</SelectTrigger>
								<SelectContent>
									{LIST_TYPE_OPTIONS.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						{type === "Todo" && (
							<div className="flex-1 space-y-2">
								<label className="block text-xs font-medium text-muted-foreground mb-1">
									Icon
								</label>
								<Select
									value={icon}
									onValueChange={setIcon}
									disabled={loading}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select an icon" />
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
					</div>
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
							{loading ? "Creating..." : "Create"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
