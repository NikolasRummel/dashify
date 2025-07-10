"use client";

import { dashboardBackgroundState } from "@/atoms/dashboard";
import AppModal from "@/components/pages/app/app-modal";
import RecipeCard from "@/components/pages/app/recipe/recipe-card";
import RecipeModalHeader from "@/components/pages/app/recipe/recipe-modal-header";
import RecipeTabs from "@/components/pages/app/recipe/recipe-tabs";
import AppListButton from "@/components/pages/dashboard/header/applist/AppListButton";
import UserAvatarMenu from "@/components/pages/dashboard/header/avatar/UserAvatarMenu";
import UserAvatar from "@/components/ui/user-avatar";
import { DEFAULT_BACKGROUND } from "@/lib/backgrounds";
import { Recipe } from "@/types/recipe";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [activeTab, setActiveTab] = useState<string>("My recipes");
	const router = useRouter();
	const setBackground = useSetAtom(dashboardBackgroundState);

	useEffect(() => {
		setBackground(DEFAULT_BACKGROUND);
	}, [setBackground]);

	return (
		<>
			<div className="fixed top-0 right-0 z-50 flex flex-row items-center gap-6 p-8">
				<AppListButton />
				<UserAvatarMenu>
					<div>
						<UserAvatar className="border-[3px]" />
					</div>
				</UserAvatarMenu>
			</div>

			<div className="absolute top-0 right-0 left-0 flex h-[30%] flex-col items-center justify-center text-center">
				<RecipeTabs
					activeTab={activeTab}
					onTabChange={(tab) => setActiveTab(tab)}
					onRecipesChange={setRecipes}
				/>
			</div>

			<AppModal
				headerComponent={<RecipeModalHeader activeTab={activeTab} />}
			>
				<div className="grid grid-cols-1 gap-6 px-4 py-6 md:grid-cols-2 xl:grid-cols-4">
					{recipes?.map((recipe) => {
						return (
							<div
								key={recipe.id}
								className="relative h-50 w-full overflow-hidden rounded-xl shadow-lg"
								onClick={() =>
									router.push(`recipes/${recipe.id}`)
								}
							>
								<RecipeCard recipe={recipe} />
							</div>
						);
					})}
				</div>
			</AppModal>
		</>
	);
}
