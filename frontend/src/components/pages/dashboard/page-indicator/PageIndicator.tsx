import {
	dashboardCurrentPageState,
	dashboardIsEditingState,
	dashboardPageIndicatorState,
	dashboardsState,
} from "@/atoms/dashboard";
import { easeOutQuart } from "@/lib/motion";
import { useAtom, useAtomValue } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import CreateDashboardForm from "./CreateDashboardForm";
import DeleteDashboardButton from "./DeleteDashboardButton";
import EditDashboardForm from "./EditDashboardForm";
import ShareDashboardForm from "./ShareDashboardForm";

export default function PageIndicator() {
	const dashboards = useAtomValue(dashboardsState);
	const [currentPage, setCurrentPage] = useAtom(dashboardCurrentPageState);
	const [indicatorState, setIndicatorState] = useAtom(
		dashboardPageIndicatorState,
	);
	const isEditing = useAtomValue(dashboardIsEditingState);
	const [isHovering, setIsHovering] = useState(false);

	// Reset the indicator state when the user is not editing
	useEffect(() => {
		setIndicatorState(null);
	}, [isEditing, setIndicatorState]);

	// Determine when controls should be visible
	const shouldShowControls =
		isHovering || indicatorState !== null || dashboards.length === 0;

	return (
		<div
			className={`mb-0 flex w-full flex-col items-center gap-2 text-center text-balance text-white transition-all ${isEditing && "mb-10"}`}
		>
			{/* Dashboard name */}
			<motion.p
				key={currentPage}
				initial={{ opacity: 0 }}
				animate={{
					opacity: [0, 1, 1, 0],
				}}
				transition={{
					duration: 3,
					times: [0, 0.05, 0.95, 1],
					ease: "easeInOut",
				}}
				className="select-none"
			>
				{dashboards[currentPage]?.name}
			</motion.p>

			{/* Pill */}
			<div
				className="bg-popover/30 border-border/10 mb-4 flex h-12 w-fit items-center justify-center overflow-hidden rounded-full border p-4 backdrop-blur-xl"
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
			>
				{/* Page Dots */}
				<div className="flex gap-2">
					{dashboards.map((_, i) => (
						<div
							onClick={() => {
								if (isEditing) return;
								setCurrentPage(i);
							}}
							key={i}
							className={`h-2 w-2 cursor-pointer rounded-full transition-colors duration-300 ${
								i === currentPage
									? "bg-white"
									: "bg-white/20 hover:bg-white/50"
							}`}
						></div>
					))}
				</div>
				{(isEditing || dashboards.length === 0) && (
					<>
						{/* Control Icons */}
						<motion.div
							className="flex items-center gap-2"
							initial={{
								x: dashboards.length > 0 ? 80 : 0,
								opacity: 0,
								width: 0,
							}}
							animate={{
								x: shouldShowControls ? 0 : 80,
								opacity: shouldShowControls ? 1 : 0,
								width: shouldShowControls ? "auto" : 0,
								marginLeft: shouldShowControls ? 8 : 0,
								marginRight: shouldShowControls ? 8 : 0,
							}}
							transition={{
								duration: 0.5,
								ease: easeOutQuart,
							}}
						>
							<HiPlus
								onClick={() =>
									setIndicatorState(
										indicatorState === "create"
											? null
											: "create",
									)
								}
								className={`shrink-0 cursor-pointer text-lg text-white transition-all duration-300 ${
									indicatorState === "create"
										? "rotate-[135deg] opacity-100"
										: "opacity-50 hover:opacity-80"
								}`}
							/>

							{dashboards.length > 0 && (
								<>
									<HiPencil
										onClick={() =>
											setIndicatorState(
												indicatorState === "edit"
													? null
													: "edit",
											)
										}
										className={`shrink-0 cursor-pointer text-lg text-white transition-all duration-300 ${
											indicatorState === "edit"
												? "opacity-100"
												: "opacity-50 hover:opacity-80"
										}`}
									/>
									<FaUserFriends
										onClick={() =>
											setIndicatorState(
												indicatorState === "share"
													? null
													: "share",
											)
										}
										className={`shrink-0 cursor-pointer text-lg text-white transition-all duration-300 ${
											indicatorState === "share"
												? "opacity-100"
												: "opacity-50 hover:opacity-80"
										}`}
									/>
									<HiTrash
										onClick={() =>
											setIndicatorState(
												indicatorState === "delete"
													? null
													: "delete",
											)
										}
										className={`shrink-0 cursor-pointer text-lg text-red-400 transition-all duration-300 ${
											indicatorState === "delete"
												? "opacity-100"
												: "opacity-50 hover:opacity-80"
										}`}
									/>
								</>
							)}
						</motion.div>
						{/* Control Actions */}
						<AnimatePresence mode="wait">
							<motion.div
								key={indicatorState || "none"}
								initial={{ opacity: 0, filter: "blur(8px)" }}
								animate={{
									opacity: indicatorState ? 1 : 0,
									filter: indicatorState
										? "blur(0px)"
										: "blur(8px)",
								}}
								exit={{ opacity: 0, filter: "blur(8px)" }}
								transition={{
									duration: 0.5,
									ease: easeOutQuart,
								}}
							>
								{indicatorState === "create" && (
									<CreateDashboardForm />
								)}
								{indicatorState === "edit" && (
									<EditDashboardForm
										dashboard={dashboards[currentPage]}
									/>
								)}
								{indicatorState === "delete" && (
									<DeleteDashboardButton
										dashboard={dashboards[currentPage]}
									/>
								)}
								{indicatorState === "share" && (
									<ShareDashboardForm
										dashboard={dashboards[currentPage]}
									/>
								)}
							</motion.div>
						</AnimatePresence>
					</>
				)}
			</div>
		</div>
	);
}
