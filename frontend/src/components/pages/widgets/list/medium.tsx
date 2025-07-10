"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { getLists, updateListItem } from "@/lib/api/list";
import { List } from "@/types/list";
import React, { useEffect, useMemo, useState } from "react";
import * as FaIcons from "react-icons/fa6";
import { LuListTodo } from "react-icons/lu";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	FaCartShopping: FaIcons.FaCartShopping,
};

export default function ListLarge() {
	const [list, setList] = useState<List | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		const fetchLists = async () => {
			try {
				const response = await getLists();
				if (mounted) setList(response);
			} catch {
				if (mounted) setList(null);
			} finally {
				if (mounted) setLoading(false);
			}
		};

		fetchLists();

		return () => {
			mounted = false;
		};
	}, []);

	const items = useMemo(() => list?.items ?? [], [list]);
	const visibleItems = useMemo(() => items.slice(0, 3), [items]);
	const remainingCount = useMemo(
		() => Math.max(items.length - 3, 0),
		[items],
	);

	const handleCheckboxChange = (itemId: number) => {
		setList((prevList) => {
			if (!prevList) return prevList;
			const updatedItems = prevList.items.map((item) =>
				item.id === itemId ? { ...item, done: !item.done } : item,
			);
			const updatedItem = updatedItems.find((item) => item.id === itemId);
			if (updatedItem) updateListItem(updatedItem);
			return {
				...prevList,
				items: updatedItems,
			};
		});
	};

	return (
		<div className="w-full h-full flex items-center justify-center text-white p-3">
			{loading ? (
				<div className="w-full flex-1 flex items-center justify-center text-xs">
					Loading...
				</div>
			) : !list ? (
				<div className="w-full flex-1 flex items-center justify-center text-xs">
					No list found.
				</div>
			) : (
				<>
					<div className="flex flex-col justify-between w-1/3 h-full min-w-0">
						<div className="rounded-full h-6 w-6 flex justify-center items-center bg-primary/20">
							{list.icon && iconMap[list.icon] ? (
								React.createElement(iconMap[list.icon], {
									className: "size-3 aspect-square",
								})
							) : (
								<LuListTodo className="size-3 aspect-square" />
							)}
						</div>
						<div className="flex flex-col mt-4">
							<div className="text-4xl leading-none">
								{list.items?.length}
							</div>
							<span className="text-xs text-primary/60 font-medium line-clamp-1 text-ellipsis ">
								{list.name}
							</span>
						</div>
					</div>
					<div className="flex flex-col justify-start h-full flex-1 px-2">
						{visibleItems.length === 0 ? (
							<div className="text-[10px] font-normal text-center py-4">
								No items in this list.
							</div>
						) : (
							visibleItems.map((item, idx) => (
								<div key={item.id}>
									<div className="flex items-center gap-2 p-1.5 rounded-lg">
										<Checkbox
											className=""
											variant="circle"
											onCheckedChange={() =>
												handleCheckboxChange(item.id)
											}
										/>
										<div className="text-[10px] font-normal line-clamp-1 text-ellipsis">
											{item.text}
										</div>
									</div>
									{idx < visibleItems.length - 1 && (
										<Separator className="my-0" />
									)}
								</div>
							))
						)}
						{remainingCount > 0 && (
							<>
								<Separator className="my-0" />
								<div className="text-[8px] font-normal text-primary/60 py-1 ml-1">
									+{remainingCount} more
								</div>
							</>
						)}
					</div>
				</>
			)}
		</div>
	);
}
