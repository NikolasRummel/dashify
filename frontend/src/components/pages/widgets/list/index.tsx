import ListSmall from "./small";
import ListMedium from "./medium";
import ListLarge from "./large";
import { WidgetCategory } from "@/types/dashboard";
import { LuCircleCheck } from "react-icons/lu";

export const listWidgets: WidgetCategory = {
	type: "LIST",
	title: "List",
	icon: <LuCircleCheck />,
	color: "#AA3D97",
	widgets: [
		{
			title: "Small List Widget",
			description: "Displays entries of a list.",
			w: 1,
			h: 1,
			component: <ListSmall />,
		},
		{
			title: "Medium List Widget",
			description: "Displays entries of a list.",
			w: 2,
			h: 1,
			component: <ListMedium />,
		},
		{
			title: "Large List Widget",
			description: "Displays entries of a list.",
			w: 2,
			h: 2,
			component: <ListLarge />,
		},
	],
};
