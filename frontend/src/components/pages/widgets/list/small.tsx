"use client";

import { getLists } from "@/lib/api/list";
import { List } from "@/types/list";
import React, { useEffect, useMemo, useState } from "react";
import * as FaIcons from "react-icons/fa6";
import { LuListTodo } from "react-icons/lu";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	FaCartShopping: FaIcons.FaCartShopping,
};

export default function ListSmall() {
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

	return (
		<div className="flex h-full w-full flex-col p-3 text-white">
			{loading ? (
				<div className="w-full flex-1 flex items-center justify-center text-xs">
					Loading...
				</div>
			) : !list ? (
				<div className="w-full flex-1 flex items-center justify-center text-xs">
					No list found.
				</div>
			) : (
				<div className="flex flex-col justify-between h-full w-full">
					<div className="flex gap-2 items-center text-sm font-normal">
						<div className="rounded-full shrink-0 h-6 w-6 flex justify-center items-center bg-primary/20">
							{list.icon && iconMap[list.icon] ? (
								React.createElement(iconMap[list.icon], {
									className: "size-3",
								})
							) : (
								<LuListTodo className="size-3" />
							)}
						</div>
						<div className="text-xs text-primary/60 line-clamp-1 font-medium text-ellipsis">
							{list.name}
						</div>
					</div>
					<div className="flex flex-col gap-0">
						<div className="text-5xl">{items.length}</div>
						<div className="text-xs text-primary/60 font-medium">
							{items.length === 0 ? "No items" : "Items"}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
