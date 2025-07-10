import { WidgetCategory } from "@/types/dashboard";
import DebugSmall from "./small";
import DebugMedium from "./medium";
import DebugLarge from "./large";
import { LuBug } from "react-icons/lu";

export const debugWidgets: WidgetCategory = {
	type: "DEBUG",
	title: "Debug",
	icon: <LuBug />,
	color: "#000000", // Replace with a suitable color
	widgets: [
		{
			title: "Small Debug Widget",
			description: "Debug",
			w: 1,
			h: 1,
			component: <DebugSmall />,
		},
		{
			title: "Medium Debug Widget",
			description: "Debug",
			w: 2,
			h: 1,
			component: <DebugMedium />,
		},
		{
			title: "Large Debug Widget",
			description: "Debug",
			w: 2,
			h: 2,
			component: <DebugLarge />,
		},
	],
};
