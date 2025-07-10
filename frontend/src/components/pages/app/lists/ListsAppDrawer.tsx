"use client";

import {
	activeListTypeAtom,
	allListsAtom,
	listsDrawerOpenAtom,
	searchQueryAtom,
	statsAtom,
	updateListAtom,
} from "@/atoms/lists";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { getAllLists } from "@/lib/api/list";
import { useAtom, useSetAtom } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import ListContent from "./ListContent";
import ListNavigationTabs from "./ListNavigationTabs";
import ListSidebar from "./ListSidebar";

export default function ListsDrawer() {
	const [isOpen, setIsOpen] = useAtom(listsDrawerOpenAtom);
	const [activeType] = useAtom(activeListTypeAtom);
	const [searchQuery] = useAtom(searchQueryAtom);
	const setAllLists = useSetAtom(allListsAtom);
	const setSearchQuery = useSetAtom(searchQueryAtom);
	const stats = useAtom(statsAtom)[0];
	const [updateList] = useAtom(updateListAtom);

	// Fetch lists only when drawer opens
	useEffect(() => {
		if (isOpen) {
			const fetchLists = async () => {
				try {
					const lists = await getAllLists();
					setAllLists(lists);
				} catch (error) {
					console.error("Error fetching lists:", error);
					setAllLists([]);
				}
			};
			fetchLists();
		}
	}, [isOpen, setAllLists, updateList]);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			setSearchQuery("");
		}
	};

	return (
		<Drawer
			open={isOpen}
			onOpenChange={handleOpenChange}
			shouldScaleBackground={false}
		>
			<DrawerContent
				showOverlay={false}
				className="md:left-[5%] md:right-[5%] md:mx-auto md:max-w-[90%] h-11/12 -mb-16"
			>
				<div className="p-2 h-full">
					<ListNavigationTabs />
					<DrawerHeader className="text-start">
						<DrawerTitle className="text-2xl font-bold flex flex-col">
							{activeType === "Todo" && "Todo Lists"}
							{activeType === "Shopping" && "Shopping Lists"}
						</DrawerTitle>
						<DrawerDescription>
							{stats.total} Items
						</DrawerDescription>
					</DrawerHeader>

					<AnimatePresence mode="wait">
						<motion.div
							key={activeType}
							initial={{
								x: -10,
								opacity: 0,
								filter: "blur(4px)",
							}}
							animate={{
								x: 0,
								opacity: 1,
								filter: "blur(0px)",
							}}
							exit={{
								x: 10,
								opacity: 0,
								filter: "blur(4px)",
							}}
							transition={{ duration: 0.2 }}
							className="h-full"
						>
							<div className="flex px-4 gap-4 space-x-2 h-full">
								{!searchQuery && (
									<>
										<div className="w-[500px] h-10/12 overflow-y-auto hide-scrollbar">
											<ListSidebar />
										</div>
										<Separator
											orientation="vertical"
											className="h-auto bg-primary/10"
										/>
									</>
								)}
								<div
									className={`w-full h-[75vh] overflow-y-auto hide-scrollbar -mt-12 ${
										searchQuery ? "p-0 mt-4" : "p-4"
									}`}
								>
									<ListContent />
								</div>
							</div>
						</motion.div>
					</AnimatePresence>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
