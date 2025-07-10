"use client";

import { LinearBlur } from "@/components/ui/linear-progressive-blur";
import { getRandomRecipe } from "@/lib/api/recipe";
import { formatCookingTime } from "@/lib/time";
import { Recipe } from "@/types/recipe";
import { useEffect, useState } from "react";
import { FaFire } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { MdEgg } from "react-icons/md";
import { PiBowlSteamFill } from "react-icons/pi";
import AnimatedText from "../shared/animated-text";
import AnimatedWidgetBackground from "../shared/animated-widget-background";

export default function RandomRecipe() {
	const [recipe, setRecipe] = useState<Recipe>();

	useEffect(() => {
		const fetchRecipe = () => {
			getRandomRecipe().then((response) => {
				setRecipe(response);
			});
		};
		fetchRecipe();
		const interval = setInterval(fetchRecipe, 15000);
		return () => clearInterval(interval);
	}, []);

	if (!recipe) return null;

	return (
		<div className="relative h-full w-full">
			<AnimatedWidgetBackground src={recipe.image} />
			<LinearBlur
				side="bottom"
				className="absolute -right-1 -bottom-1 -left-1 h-5/6"
				tint="color-mix(in oklab, var(--color-widget-accent) 60%, var(--primary-foreground))"
			/>
			<div className="absolute right-0 bottom-0 left-0 flex flex-row justify-between p-4">
				<div className="w-full flex flex-col items-start">
					<span className="font-normal text-white/50 line-clamp-1 text-[10px]">
						Explore Recipes
					</span>
					<AnimatedText className="leading-4 text-white/95 text-[12px]">
						{recipe.name}
					</AnimatedText>
					<p className="mt-4 line-clamp-2 leading-4 font-normal text-white/75 text-[10px]">
						{recipe.description}
					</p>
				</div>
				<div className="flex w-fit flex-col items-end font-normal text-[10px]">
					<span className="flex items-center gap-2 text-white/80 line-clamp-1 w-max">
						{recipe.portions} portion{recipe.portions > 1 && "s"}{" "}
						<PiBowlSteamFill />
					</span>
					<span className="flex items-center gap-2 text-white/80 line-clamp-1 w-max">
						{recipe.cookingTime !== undefined
							? formatCookingTime(recipe.cookingTime)
							: "—"}{" "}
						<FaClock />
					</span>
					<span className="flex items-center gap-2 text-white/80 line-clamp-1 w-max">
						{recipe.calories} kcal <FaFire />
					</span>
					<span className="flex items-center gap-1.5 text-white/80 line-clamp-1 w-max">
						{recipe.protein} g{" "}
						<MdEgg
							size={14}
							className="-mr-0.5"
						/>
					</span>
				</div>
			</div>
		</div>
	);
}
