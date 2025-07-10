"use client";

import { updateListAtom } from "@/atoms/lists";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { updateListItem } from "@/lib/api/list";
import { ListItem } from "@/types/list";
import { format } from "date-fns";
import { useSetAtom } from "jotai";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface EditListItemDialogProps {
	item: ListItem;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onItemUpdated: (updatedItem: ListItem) => void;
}

export default function EditListItemDialog({
	item,
	open,
	onOpenChange,
	onItemUpdated,
}: EditListItemDialogProps) {
	const [text, setText] = useState(item.text);
	const [deadline, setDeadline] = useState<Date | null>(
		item.deadline ? new Date(item.deadline) : null,
	);
	const [loading, setLoading] = useState(false);
	const [calendarOpen, setCalendarOpen] = useState(false);
	const setUpdateList = useSetAtom(updateListAtom);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim()) return;

		setLoading(true);
		try {
			const updatedItem = await updateListItem({
				...item,
				text: text.trim(),
				deadline: deadline ? deadline.toISOString() : "",
			});
			if (!updatedItem) {
				throw new Error(
					"Failed to update item: No response from server",
				);
			}

			// Notify parent component of the update
			onItemUpdated(updatedItem);
			onOpenChange(false);
			setUpdateList((prev) => prev + 1);
		} catch (error) {
			console.error("Failed to update item:", error);
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
						Edit Item
					</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={handleSubmit}
					className="space-y-6"
				>
					<div className="space-y-2">
						<label className="block text-xs font-medium text-muted-foreground mb-1">
							Item Text
						</label>
						<Input
							placeholder="Item text"
							value={text}
							onChange={(e) => setText(e.target.value)}
							disabled={loading}
						/>
					</div>
					<div className="space-y-2">
						<label className="block text-xs font-medium text-muted-foreground mb-1">
							Deadline
						</label>
						<Popover
							open={calendarOpen}
							onOpenChange={setCalendarOpen}
						>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									data-empty={!deadline}
									className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
									disabled={loading}
								>
									<CalendarIcon />
									{deadline ? (
										format(deadline, "PPP")
									) : (
										<span>Pick a date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0 rounded-xl">
								<Calendar
									mode="single"
									selected={deadline || undefined}
									onSelect={(date) => {
										setDeadline(date || null);
										setCalendarOpen(false);
									}}
								/>
							</PopoverContent>
						</Popover>
					</div>
					<div className="flex justify-end pt-2">
						<Button
							type="submit"
							disabled={loading || !text.trim()}
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
