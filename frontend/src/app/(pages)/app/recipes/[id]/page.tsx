"use client";

import { dashboardBackgroundState } from "@/atoms/dashboard";
import ModifyRecipeMenu from "@/components/pages/app/recipe/recipe-form/recipe-dialog";
import AppListButton from "@/components/pages/dashboard/header/applist/AppListButton";
import UserAvatarMenu from "@/components/pages/dashboard/header/avatar/UserAvatarMenu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/ui/user-avatar";
import { getRecipe } from "@/lib/api/recipe";
import { DEFAULT_BACKGROUND } from "@/lib/backgrounds";
import { Ingredient, mapRecipeToFormValues, Recipe } from "@/types/recipe";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useSetAtom } from "jotai";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RecipePage() {
	const setBackground = useSetAtom(dashboardBackgroundState);
	const params = useParams<{ id: string }>();
	const [recipe, setRecipe] = useState<Recipe>();
	const router = useRouter();

	useEffect(() => {
		setBackground(DEFAULT_BACKGROUND);

		async function loadRecipe() {
			try {
				const data = await getRecipe(parseInt(params.id));
				setRecipe(data);
			} catch (error) {
				console.error("Failed to load recipe:", error);
			}
		}

		loadRecipe();
	}, [params.id, setBackground]);

	if (!recipe) return <div className="text-white px-4">Loading...</div>;

	return (
		<>
			<div className="fixed top-0 right-0 z-50 flex flex-row items-center gap-6 p-8">
				<AppListButton />
				<UserAvatarMenu>
					<UserAvatar className="border-[3px]" />
				</UserAvatarMenu>
			</div>

			<div className="absolute right-[5%] bottom-0 left-[5%] h-[80%] w-[90%] rounded-t-2xl bg-[#2b2b2f]/98 text-white shadow-2xl flex flex-col">
				<div className="flex-1 overflow-hidden">
					<ScrollArea.Root className="h-full w-full">
						<ScrollArea.Viewport className="h-full w-full px-6 pb-6">
							<div className=" rounded-2xl p-6 flex w-full max-w-6xl gap-8">
								{/* Left Section */}
								<div className="flex-1">
									<div className="flex items-center justify-between mb-4">
										<Button
											variant="ghost"
											className="mb-4"
											onClick={() =>
												router.push(`/app/recipes`)
											}
										>
											<ChevronLeft /> My Recipes
										</Button>
										<ModifyRecipeMenu
											id={recipe.id}
											userId={recipe.userId}
											initialRecipe={mapRecipeToFormValues(
												recipe,
											)}
										/>
									</div>
									<h1 className="text-2xl font-bold mb-2">
										{recipe.name}
									</h1>
									<p className="text-gray-300 mb-6">
										{recipe.description}
									</p>

									{/* Info Section */}
									<Separator className="mb-4" />
									<div className="flex gap-6 text-sm text-gray-300 mb-6 flex-wrap">
										<span>
											🍽️ {recipe.portions} Portion
											{recipe.portions > 1 ? "en" : ""}
										</span>
										<span>
											⏱️ {recipe.preparation || "—"} prep
										</span>
										<span>🔥 {recipe.calories} kcal</span>
										<span>💧 {recipe.fat}g Fat</span>
										<span>
											🥩 {recipe.protein}g Protein
										</span>
										<span>
											🍚 {recipe.carbohydrates}g Carbs
										</span>
									</div>
									<Separator className="mb-4" />

									{/* Preparation HTML */}
									<div className="prose prose-invert text-sm max-w-none mb-6">
										<div
											dangerouslySetInnerHTML={{
												__html: recipe.instructions,
											}}
										/>
									</div>
								</div>

								<Separator
									orientation="vertical"
									className=" w-[2px] h-auto"
								/>

								<div className="w-[300px] shrink-0 space-y-4">
									<div className="relative h-[200px] w-full rounded-xl overflow-hidden bg-gray-700">
										{recipe.image ? (
											<Image
												src={recipe.image}
												alt={recipe.name}
												width={200}
												height={100}
												className="object-cover w-full h-[200px] rounded-xl"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
												No image
											</div>
										)}
									</div>
									<Separator className="mb-4" />

									{/* Ingredients */}
									<div>
										<h2 className="text-lg font-semibold mb-2">
											Ingredients
										</h2>
										<ul className="text-sm text-gray-200 space-y-1">
											{recipe.ingredients?.map(
												(item: Ingredient) => (
													<li key={item.id}>
														• <b>{item.amount}</b>{" "}
														{item.unit} {item.name}
													</li>
												),
											)}
										</ul>
									</div>

									<button className="w-full mt-4 bg-white text-black py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition">
										+ Add to list
									</button>
								</div>
							</div>
						</ScrollArea.Viewport>
						<ScrollArea.Scrollbar
							className="hidden"
							orientation="vertical"
						>
							<ScrollArea.Thumb className="flex-1 bg-white/40 rounded-full relative" />
						</ScrollArea.Scrollbar>
					</ScrollArea.Root>
				</div>
			</div>
		</>
	);
}
