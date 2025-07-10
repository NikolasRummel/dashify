import { WidgetCategory } from "@/types/dashboard";
import { batteryWidgets } from "./battery";
import { catsWidgets } from "./cats";
import { clockWidgets } from "./clock";
import { debugWidgets } from "./debug";
import { dogsWidgets } from "./dogs";
import { listWidgets } from "./list";
import { mapWidgets } from "./map";
import { mealPlanWidgets } from "./meal-plan";
import { menuWidgets } from "./menu";
import { recipeWidgets } from "./recipe";
import { weatherWidgets } from "./weather";

export const widgetCategories: WidgetCategory[] = [
	clockWidgets,
	mealPlanWidgets,
	menuWidgets,
	recipeWidgets,
	listWidgets,
	weatherWidgets,
	mapWidgets,
	catsWidgets,
	dogsWidgets,
	batteryWidgets,
	debugWidgets,
];
