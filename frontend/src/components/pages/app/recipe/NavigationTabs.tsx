import { RecipeNavigationState, recipesNavigationAtom } from "@/atoms/recipes";
import { easeOutQuart } from "@/lib/motion";
import { useAtom } from "jotai";
import { motion } from "motion/react";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import RecipeSearch from "./RecipeSearch";

const TRANSITION = {
	duration: 0.3,
	ease: easeOutQuart,
};

const TABS = [
	{ label: "My Recipes", value: "tab-my-recipes" },
	{ label: "Explore", value: "tab-explore" },
	{ label: "Shared with me", value: "tab-shared-with-me" },
];

export default function RecipeNavigationTabs() {
	const [activeTab, setActiveTab] = useAtom(recipesNavigationAtom);
	const tabsRef = useRef<HTMLDivElement>(null);
	const activeIndex = TABS.findIndex((tab) => tab.value === activeTab);
	const [indicatorProps, setIndicatorProps] = useState({ left: 0, width: 0 });
	const [isSearching, setIsSearching] = useState(false);
	const [isReady, setIsReady] = useState(false);

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
		(tabValue: RecipeNavigationState) => {
			setActiveTab(tabValue);
		},
		[setActiveTab],
	);

	return (
		<div className="flex flex-row w-[512px] absolute left-1/2 -translate-x-1/2 -top-16 h-12 items-center gap-3">
			{/* Search button/input */}
			<motion.div
				className="overflow-hidden h-full flex-shrink-0"
				animate={{
					width: isSearching ? "100%" : "48px",
					flex: isSearching ? 1 : "0 0 48px",
				}}
				transition={TRANSITION}
			>
				{isSearching ? (
					<RecipeSearch />
				) : (
					<div className="flex items-center justify-center w-full h-full">
						<button
							onClick={() => setIsSearching(true)}
							className="w-12 h-12 bg-popover/70 backdrop-blur-xl text-popover-foreground rounded-full flex items-center justify-center border border-border/70 z-10"
						>
							<IoSearch size={18} />
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
							onClick={() =>
								handleTabClick(
									tab.value as RecipeNavigationState,
								)
							}
							className="text-center text-sm h-full z-50 relative font-medium focus:outline-none transition-colors duration-300 flex-1"
						>
							<span
								className={`
									line-clamp-1
									${
										activeTab === tab.value
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

			{/* Close search button */}
			<motion.div
				className="flex-shrink-0"
				animate={{
					opacity: isSearching ? 1 : 0,
					width: isSearching ? "48px" : 0,
					scale: isSearching ? 1 : 0,
				}}
				transition={TRANSITION}
			>
				<button
					onClick={() => {
						setIsSearching(false);
						if (activeTab === "search") {
							setActiveTab("tab-my-recipes");
						}
					}}
					className="w-12 h-12 bg-popover/70 backdrop-blur-[12px] text-popover-foreground rounded-full flex items-center justify-center border border-border/70 z-10"
					style={{ WebkitBackdropFilter: "blur(12px)" }}
				>
					<IoClose size={18} />
				</button>
			</motion.div>
		</div>
	);
}
