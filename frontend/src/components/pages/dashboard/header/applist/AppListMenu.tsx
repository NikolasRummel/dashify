import { dashboardAppListIsOpenState } from "@/atoms/dashboard";
import { listsDrawerOpenAtom } from "@/atoms/lists";
import { recipeAppDrawerOpenState } from "@/atoms/recipes";
import { ModalContent, ModalTitle } from "@/components/ui/modal";
import StaggerContainerWrapper from "@/components/wrappers/motion/stagger/container-wrapper";
import StaggerItemWrapper from "@/components/wrappers/motion/stagger/item-wrapper";
import { easeOutQuart } from "@/lib/motion";
import { useSetAtom } from "jotai";
import { FaCircleCheck } from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";
import AppIcon from "./AppIcon";

export default function AppListMenu() {
	const setOpenListsAppDrawer = useSetAtom(listsDrawerOpenAtom);
	const setOpenRecipeAppDrawer = useSetAtom(recipeAppDrawerOpenState);
	const setDashboardAppListIsOpen = useSetAtom(dashboardAppListIsOpenState);

	return (
		<ModalContent className="mt-2 flex w-full flex-col justify-center gap-3 overflow-clip rounded-4xl">
			<ModalTitle className="sr-only">App List</ModalTitle>
			<StaggerContainerWrapper
				className="flex h-full flex-col items-start gap-5 py-3"
				staggerDelay={0.075}
			>
				<StaggerItemWrapper
					duration={0.5}
					ease={easeOutQuart}
					variants={{
						hidden: {
							opacity: 0,
							y: "-200%",
							filter: "blur(10px)",
						},
						visible: {
							opacity: 1,
							y: "0%",
							filter: "blur(0px)",
						},
					}}
				>
					<AppIcon
						name="Recipes"
						color="white"
						bgColor="#FF6B6B"
						icon={<IoFastFood size={25} />}
						onClick={() => {
							setOpenRecipeAppDrawer(true);
							setDashboardAppListIsOpen(false);
						}}
					/>
				</StaggerItemWrapper>
				<StaggerItemWrapper
					duration={0.5}
					ease={easeOutQuart}
					variants={{
						hidden: {
							opacity: 0,
							y: "-200%",
							filter: "blur(10px)",
						},
						visible: {
							opacity: 1,
							y: "0%",
							filter: "blur(0px)",
						},
					}}
				>
					<AppIcon
						name="Lists"
						color="white"
						bgColor="#4CC830"
						icon={<FaCircleCheck size={25} />}
						onClick={() => {
							setOpenListsAppDrawer(true);
							setDashboardAppListIsOpen(false);
						}}
					/>
				</StaggerItemWrapper>
			</StaggerContainerWrapper>
		</ModalContent>
	);
}
