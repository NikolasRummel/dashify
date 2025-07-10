import RandomRecipeSmall from "./small";
import RandomRecipeMedium from "./medium";
import RandomRecipeLarge from "./large";
import { WidgetCategory } from "@/types/dashboard";
import { LuRefreshCcw } from "react-icons/lu";

export const recipeWidgets: WidgetCategory = {
	type: "RECIPE",
	title: "Recipe",
	icon: <LuRefreshCcw />,
	color: "#6BBA46",
	widgets: [
		{
			title: "Small Random Recipe Widget",
			description: "Displays a random recipe.",
			w: 1,
			h: 1,
			component: <RandomRecipeSmall />,
		},
		{
			title: "Medium Random Recipe Widget",
			description: "Displays a random recipe.",
			w: 2,
			h: 1,
			component: <RandomRecipeMedium />,
		},
		{
			title: "Large Random Recipe Widget",
			description: "Displays a random recipe.",
			w: 2,
			h: 2,
			component: <RandomRecipeLarge />,
		},
	],
};
