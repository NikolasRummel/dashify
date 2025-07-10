"use client";

import { listsDrawerOpenAtom } from "@/atoms/lists";
import { recipeAppDrawerOpenState } from "@/atoms/recipes";
import ListsDrawer from "@/components/pages/app/lists/ListsAppDrawer";
import RecipeAppDrawer from "@/components/pages/app/recipe/RecipeAppDrawer";
import AddWidgetButton from "@/components/pages/dashboard/buttons/AddWidgetButton";
import FinishEditingButton from "@/components/pages/dashboard/buttons/FinishEditingButton";
import DashboardContextMenu from "@/components/pages/dashboard/DashboardContextMenu";
import DashboardsCarousel from "@/components/pages/dashboard/DashboardsCarousel";
import WidgetDrawer from "@/components/pages/dashboard/drawer/WidgetDrawer";
import AppListButton from "@/components/pages/dashboard/header/applist/AppListButton";
import UserAvatarMenu from "@/components/pages/dashboard/header/avatar/UserAvatarMenu";
import Greeting from "@/components/pages/dashboard/header/Greeting";
import PageIndicator from "@/components/pages/dashboard/page-indicator/PageIndicator";
import UserAvatar from "@/components/ui/user-avatar";
import StaggerContainerWrapper from "@/components/wrappers/motion/stagger/container-wrapper";
import StaggerItemWrapper from "@/components/wrappers/motion/stagger/item-wrapper";
import { easeOutQuart } from "@/lib/motion";
import { useAtomValue } from "jotai";

export default function Page() {
	const animationVariants = {
		hidden: {
			opacity: 0,
			y: -196,
			filter: "blur(16px) brightness(4)",
		},
		visible: {
			opacity: 1,
			y: 0,
			filter: "blur(0px) brightness(1)",
		},
	};
	const animationDuration = 1;
	const isListsAppDrawerOpen = useAtomValue(listsDrawerOpenAtom);
	const isRecipeAppDrawerOpen = useAtomValue(recipeAppDrawerOpenState);

	const drawerHideDashboardContent =
		isListsAppDrawerOpen || isRecipeAppDrawerOpen;

	return (
		<>
			{/* Header */}
			<div className="flex w-full flex-col items-end p-8">
				<StaggerContainerWrapper
					className="z-50 flex flex-row items-center gap-6"
					staggerDelay={0.075}
				>
					<StaggerItemWrapper
						duration={animationDuration}
						variants={animationVariants}
						ease={easeOutQuart}
					>
						<AppListButton />
					</StaggerItemWrapper>
					<StaggerItemWrapper
						duration={animationDuration}
						variants={animationVariants}
						ease={easeOutQuart}
					>
						<UserAvatarMenu>
							<UserAvatar className="border-[3px]" />
						</UserAvatarMenu>
					</StaggerItemWrapper>
				</StaggerContainerWrapper>
				<div
					className={`duration-500 transition-all flex h-full w-full flex-col items-center justify-center ${drawerHideDashboardContent ? "opacity-0" : "opacity-100"}`}
				>
					<Greeting />
				</div>
			</div>
			{/* Dashboards */}
			<div
				className={`duration-500 transition-all flex h-full w-full flex-col items-center justify-center ${drawerHideDashboardContent ? "opacity-0" : "opacity-100"}`}
			>
				<DashboardContextMenu>
					<DashboardsCarousel />
				</DashboardContextMenu>
			</div>
			{/* Footer / Bottom Elements */}
			<div className="fixed right-0 bottom-0 left-0 z-50 flex flex-col items-center">
				<PageIndicator />
				<FinishEditingButton />
				<AddWidgetButton />
				<WidgetDrawer />
			</div>
			{/* Apps */}
			<RecipeAppDrawer />
			<ListsDrawer />
		</>
	);
}
