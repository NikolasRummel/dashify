"use client";

import { LinearBlur } from "@/components/ui/linear-progressive-blur";
import { getRandomRecipe } from "@/lib/api/recipe";
import { Recipe } from "@/types/recipe";
import { useEffect, useState } from "react";
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
			<div className="absolute right-0 bottom-4 left-0 p-4 flex flex-row justify-between">
				<div className="w-full flex flex-col items-start">
					<span className="font-normal text-white/50 line-clamp-1 text-[10px]">
						Explore Recipes
					</span>
					<AnimatedText className="leading-4 text-white/90 text-[12px]">
						{recipe.name}
					</AnimatedText>
				</div>
			</div>
		</div>
	);
}
