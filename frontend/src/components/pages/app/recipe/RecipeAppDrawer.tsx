import {
	aiDialogOpenState,
	recipeAppDrawerOpenState,
	recipeFormDialogOpenState,
	recipesNavigationAtom,
	selectedRecipeAtom,
} from "@/atoms/recipes";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContentWithHeader,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/use-session";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AiFillEdit } from "react-icons/ai";
import { HiMiniSparkles } from "react-icons/hi2";
import AiDialog from "./AiDialog";
import RecipeNavigationTabs from "./NavigationTabs";
import RecipeFormDialog from "./recipe-form/RecipeFormDialog";
import RecipeActions from "./RecipeActions";
import DisplayRecipe from "./tabs/DisplayRecipe";
import Explore from "./tabs/Explore";
import MyRecipes from "./tabs/MyRecipes";
import SearchResults from "./tabs/SearchResults";
import SharedWithMe from "./tabs/SharedWithMe";

export default function RecipeAppDrawer() {
	const [open, setOpen] = useAtom(recipeAppDrawerOpenState);
	const [activeTab, setActiveTab] = useAtom(recipesNavigationAtom);
	const setOpenFormDialog = useSetAtom(recipeFormDialogOpenState);
	const selectedRecipe = useAtomValue(selectedRecipeAtom);
	const setOpenAiDialog = useSetAtom(aiDialogOpenState);

	const session = useSession();

	const isUserRecipeCreator = () => {
		if (!selectedRecipe) return false;
		const userId = session.user?.id;
		return userId === selectedRecipe.userId;
	};

	return (
		<Drawer
			open={open}
			onOpenChange={setOpen}
			shouldScaleBackground={false}
		>
			<DrawerContentWithHeader
				showOverlay={false}
				className="md:left-[5%] md:right-[5%] h-11/12 -mb-16"
				header={<RecipeNavigationTabs />}
			>
				<RecipeFormDialog />
				<AiDialog />
				<div className="p-2">
					<DrawerHeader className="text-start">
						<DrawerTitle className="text-2xl font-bold flex flex-col">
							{activeTab === "search" && "Search"}
							{activeTab === "tab-explore" && "Explore"}
							{activeTab === "tab-my-recipes" && "My Recipes"}
							{activeTab === "tab-shared-with-me" &&
								"Shared with Me"}
							{activeTab === "tab-my-recipes" && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 absolute right-6"
										>
											<PlusIcon />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										alignOffset={8}
									>
										<DropdownMenuItem
											onClick={() => {
												setOpenFormDialog(true);
											}}
										>
											<AiFillEdit
												size={16}
												className="mr-1.5"
											/>
											Enter manually
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => {
												setOpenAiDialog(true);
											}}
										>
											<HiMiniSparkles
												size={16}
												className="mr-1.5"
											/>
											Create with AI
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
							{activeTab === "display-recipe" && (
								<>
									<div className="flex w-full justify-between">
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8"
											onClick={() => {
												setActiveTab("tab-my-recipes");
											}}
										>
											<ChevronLeftIcon />
										</Button>
										<RecipeActions
											isUserRecipeCreator={isUserRecipeCreator()}
										/>
									</div>
									{selectedRecipe?.name}
								</>
							)}
						</DrawerTitle>
						<DrawerDescription>
							{activeTab === "search" && "Search for recipes..."}
							{activeTab === "tab-explore" &&
								"Get inspired by recipes from around the world."}
							{activeTab === "tab-my-recipes" &&
								"Recipes you've added to your cookbook."}
							{activeTab === "tab-shared-with-me" &&
								"Recipes shared with you by others."}
							{activeTab === "display-recipe" &&
								selectedRecipe?.description}
						</DrawerDescription>
					</DrawerHeader>
					<AnimatePresence mode="wait">
						<motion.div
							key={activeTab ? activeTab : "empty"}
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
						>
							{activeTab === "tab-my-recipes" && <MyRecipes />}
							{activeTab === "tab-explore" && <Explore />}
							{activeTab === "tab-shared-with-me" && (
								<SharedWithMe />
							)}
							{activeTab === "display-recipe" && (
								<DisplayRecipe />
							)}
							{activeTab === "search" && <SearchResults />}
						</motion.div>
					</AnimatePresence>
				</div>
			</DrawerContentWithHeader>
		</Drawer>
	);
}
