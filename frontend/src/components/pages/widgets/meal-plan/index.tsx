import MealPlanSmall from "./small";
import MealPlanMedium from "./medium";
import MealPlanLarge from "./large";
import { WidgetCategory } from "@/types/dashboard";
import { LuUtensils } from "react-icons/lu";

export const mealPlanWidgets: WidgetCategory = {
	type: "MEAL_PLAN",
	title: "Meal Plan",
	icon: <LuUtensils />,
	color: "#FF801A",
	widgets: [
		{
			title: "Small Meal Plan Widget",
			description: "Displays your meal plan.",
			w: 1,
			h: 1,
			component: <MealPlanSmall />,
		},
		{
			title: "Medium Meal Plan Widget",
			description: "Displays your meal plan.",
			w: 2,
			h: 1,
			component: <MealPlanMedium />,
		},
		{
			title: "Large Meal Plan Widget",
			description: "Displays your meal plan.",
			w: 2,
			h: 2,
			component: <MealPlanLarge />,
		},
	],
};
