import { WidgetCategory } from "@/types/dashboard";
import WeatherSmall from "./small";
import WeatherMedium from "./medium";
import WeatherLarge from "./large";
import { LuCloud } from "react-icons/lu";

export const weatherWidgets: WidgetCategory = {
	type: "WEATHER",
	title: "Weather",
	icon: <LuCloud />,
	color: "#4A90E2",
	widgets: [
		{
			title: "Small Weather Widget",
			description: "Displays the current weather.",
			w: 1,
			h: 1,
			component: <WeatherSmall />,
		},
		{
			title: "Medium Weather Widget",
			description: "Displays the current weather.",
			w: 2,
			h: 1,
			component: <WeatherMedium />,
		},
		{
			title: "Large Weather Widget",
			description: "Displays the current weather & forecast.",
			w: 2,
			h: 2,
			component: <WeatherLarge />,
		},
	],
};
