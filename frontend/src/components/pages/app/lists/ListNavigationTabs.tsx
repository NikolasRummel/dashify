"use client";

import {
	ListType,
	activeListTypeAtom,
	allListsAtom,
	filterModeAtom,
	isSearchingAtom,
	searchQueryAtom,
	selectedListAtom,
} from "@/atoms/lists";
import { getAllLists } from "@/lib/api/list";
import { easeOutQuart } from "@/lib/motion";
import { useAtom, useSetAtom } from "jotai";
import { PlusIcon, Search, X } from "lucide-react";
import { motion } from "motion/react";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import CreateListDialog from "./CreateListDialog";

const TRANSITION = {
	duration: 0.3,
	ease: easeOutQuart,
};

const TABS = [
	{ label: "Todo", value: "Todo" as ListType },
	{ label: "Shopping", value: "Shopping" as ListType },
];

export default function ListNavigationTabs() {
	const [activeType, setActiveType] = useAtom(activeListTypeAtom);
	const [isSearching, setIsSearching] = useAtom(isSearchingAtom);
	const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
	const setFilterMode = useSetAtom(filterModeAtom);
	const setSelectedList = useSetAtom(selectedListAtom);
	const setAllLists = useSetAtom(allListsAtom);

	const tabsRef = useRef<HTMLDivElement>(null);
	const activeIndex = TABS.findIndex((tab) => tab.value === activeType);
	const [indicatorProps, setIndicatorProps] = useState({ left: 0, width: 0 });
	const [isReady, setIsReady] = useState(false);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);

	// Function to measure and update indicator position
	const updateIndicator = useCallback(() => {
		if (!tabsRef.current || activeIndex === -1) return;

		const activeButton = tabsRef.current.children[
			activeIndex
		] as HTMLElement;
		if (!activeButton) return;

		// Use requestAnimationFrame to ensure DOM is fully updated
		requestAnimationFrame(() => {
			const rect = activeButton.getBoundingClientRect();

			setIndicatorProps({
				left: activeButton.offsetLeft,
				width: rect.width,
			});

			if (!isReady) {
				// Wait a bit longer before showing to ensure correct size
				setTimeout(() => setIsReady(true), 100);
			}
		});
	}, [activeIndex, isReady]);

	// Execute measurement after mount and when dependencies change
	useLayoutEffect(() => {
		// Initial measurement
		updateIndicator();

		// Second measurement after a small delay to catch any layout shifts
		const timer = setTimeout(() => {
			updateIndicator();
		}, 50);

		return () => clearTimeout(timer);
	}, [updateIndicator]);

	// Update on window resize
	useEffect(() => {
		window.addEventListener("resize", updateIndicator);
		return () => window.removeEventListener("resize", updateIndicator);
	}, [updateIndicator]);

	// Tab switching handler
	const handleTabClick = useCallback(
		(tabValue: ListType) => {
			setActiveType(tabValue);
			setSelectedList(null);
			setFilterMode("All items");
		},
		[setActiveType, setFilterMode, setSelectedList],
	);

	// Handle list created (refresh lists)
	const handleListCreated = async () => {
		try {
			const lists = await getAllLists();
			setAllLists(lists);
		} catch (error) {
			console.error("Error refreshing lists:", error);
		}
	};

	const handleSearchToggle = () => {
		if (isSearching) {
			setSearchQuery("");
			setIsSearching(false);
		} else {
			setIsSearching(true);
		}
	};

	return (
		<div className="flex flex-row w-[512px] absolute left-1/2 -translate-x-1/2 -top-16 h-12 items-center gap-3 z-20">
			{/* Search button or search bar */}
			<motion.div
				className="overflow-hidden h-full flex-shrink-0"
				animate={{
					width: isSearching ? "100%" : "48px",
					flex: isSearching ? 1 : "0 0 48px",
				}}
				transition={TRANSITION}
			>
				{isSearching ? (
					<div className="flex items-center w-full h-full">
						<input
							type="text"
							placeholder="Search items..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full h-full bg-popover/70 backdrop-blur-xl text-popover-foreground rounded-full px-4 py-2 outline-none border border-border/70 z-10"
						/>
					</div>
				) : (
					<div className="flex items-center justify-center w-full h-full">
						<button
							onClick={handleSearchToggle}
							className="w-12 h-12 bg-popover/70 backdrop-blur-xl text-popover-foreground rounded-full flex items-center justify-center border border-border/70 z-10"
						>
							<Search className="h-5 w-5" />
						</button>
					</div>
				)}
			</motion.div>

			{/* Navigation tabs */}
			<motion.div
				className="flex items-center h-full overflow-hidden bg-popover/70 rounded-full border border-border/70 z-10 backdrop-blur-xl"
				animate={{
					opacity: isSearching ? 0 : 1,
					width: isSearching ? 0 : "auto",
					flex: isSearching ? "0 0 0px" : 1,
				}}
				transition={TRANSITION}
				onAnimationComplete={() => {
					if (!isSearching) {
						updateIndicator();
					}
				}}
			>
				<div
					ref={tabsRef}
					className="relative flex h-full w-full justify-between items-center px-1"
				>
					{TABS.map((tab) => (
						<button
							key={tab.value}
							onClick={() => handleTabClick(tab.value)}
							className="text-center text-sm h-full z-50 relative font-medium focus:outline-none transition-colors duration-300 flex-1"
						>
							<span
								className={`
                                    line-clamp-1
                                    ${
										activeType === tab.value
											? "text-popover-foreground font-semibold"
											: "text-popover-foreground/50"
									}`}
							>
								{tab.label}
							</span>
						</button>
					))}

					{/* Tab indicator - only show when component is ready */}
					{isReady && (
						<motion.div
							className="absolute top-1 bottom-1 bg-white/40 dark:bg-white/20 rounded-full shadow-sm"
							initial={false}
							animate={{
								left: indicatorProps.left,
								width: indicatorProps.width,
							}}
							transition={TRANSITION}
						/>
					)}
				</div>
			</motion.div>

			{/* Plus/close button */}
			<motion.div
				className="flex-shrink-0"
				animate={{
					opacity: 1,
					width: "48px",
					scale: 1,
				}}
				transition={TRANSITION}
			>
				{isSearching ? (
					<button
						onClick={handleSearchToggle}
						className="w-12 h-12 bg-popover/70 backdrop-blur-[12px] text-popover-foreground rounded-full flex items-center justify-center border border-border/70 z-10"
						style={{ WebkitBackdropFilter: "blur(12px)" }}
					>
						<X className="h-5 w-5" />
					</button>
				) : (
					<>
						<button
							onClick={() => setCreateDialogOpen(true)}
							className="w-12 h-12 bg-popover/70 border border-border/70 p-3 transition-colors duration-200 hover:bg-popover/90 backdrop-blur-xl rounded-full flex items-center justify-center"
						>
							<PlusIcon className="h-5 w-5 text-popover-foreground" />
						</button>
						<CreateListDialog
							onListCreated={handleListCreated}
							type={activeType}
							open={createDialogOpen}
							onOpenChange={setCreateDialogOpen}
						/>
					</>
				)}
			</motion.div>
		</div>
	);
}
