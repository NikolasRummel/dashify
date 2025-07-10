import { WidgetCategory } from "@/types/dashboard";
import { LuSquareMenu } from "react-icons/lu";
import MenuMedium from "./medium";

export const menuWidgets: WidgetCategory = {
	type: "MENU",
	title: "Menu",
	icon: <LuSquareMenu />,
	color: "#FFB829",
	widgets: [
		{
			title: "Medium Menu Widget",
			description: "Displays your menu.",
			w: 2,
			h: 1,
			component: <MenuMedium />,
		},
	],
};
