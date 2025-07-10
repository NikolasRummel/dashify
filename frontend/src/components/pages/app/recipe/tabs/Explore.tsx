import { selectedRecipeAtom } from "@/atoms/recipes";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getPublicRecipes } from "@/lib/api/recipe";
import { Recipe } from "@/types/recipe";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import RecipeCard from "../RecipeCard";

export default function Explore() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const setSelectedRecipe = useSetAtom(selectedRecipeAtom);

	useEffect(() => {
		getPublicRecipes().then((recipes) => {
			setSelectedRecipe(null);
			setRecipes(recipes);
		});
	}, [setSelectedRecipe]);

	return (
		<ScrollArea className="h-[70vh]">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 px-4 pb-4">
				{recipes.map((recipe) => (
					<RecipeCard
						key={recipe.id}
						recipe={recipe}
					/>
				))}
			</div>
			<ScrollBar />
		</ScrollArea>
	);
}
