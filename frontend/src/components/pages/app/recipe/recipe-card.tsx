import { recipesNavigationAtom, selectedRecipeAtom } from "@/atoms/recipes";
import { LinearBlur } from "@/components/ui/linear-progressive-blur";
import { formatCookingTime } from "@/lib/time";
import { Recipe } from "@/types/recipe";
import { useSetAtom } from "jotai";
import Image from "next/image";
import { FaClock } from "react-icons/fa6";
import { PiBowlSteamFill } from "react-icons/pi";

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
	const setSelectedRecipe = useSetAtom(selectedRecipeAtom);
	const setRecipesNavigation = useSetAtom(recipesNavigationAtom);

	return (
		<div
			className="relative h-40 w-full rounded-xl overflow-clip shadow-md cursor-pointer"
			onClick={() => {
				setSelectedRecipe(recipe);
				setRecipesNavigation("display-recipe");
			}}
		>
			<Image
				src={recipe.image}
				alt={recipe.name}
				className="absolute inset-0 h-full w-full object-cover"
				loading="lazy"
				width={500}
				height={500}
			/>
			<LinearBlur
				side="bottom"
				className="absolute -right-1 -bottom-1 -left-1 h-5/6"
				tint="rgb(0 0 0 / 0.5)"
			/>
			<div className="absolute right-0 bottom-0 left-0 p-4 flex flex-row justify-between">
				<div className="w-full flex flex-col items-start">
					<span className="font-normal text-white/50 line-clamp-1 text-[10px]">
						Recipe
					</span>
					<h1 className="leading-4 font-semibold text-white/95 text-[12px]">
						{recipe.name}
					</h1>
				</div>
				<div className="w-fit flex flex-col items-end font-normal text-[10px]">
					<span className="text-white/80 flex gap-2 items-center line-clamp-1 w-max">
						{recipe.portions} portion
						{recipe.portions > 1 && "s"}
						<PiBowlSteamFill />
					</span>
					<span className="text-white/80 flex gap-2 items-center line-clamp-1 w-max">
						{recipe.cookingTime !== undefined
							? formatCookingTime(recipe.cookingTime)
							: "—"}
						<FaClock />
					</span>
				</div>
			</div>
		</div>
	);
};

export default RecipeCard;
