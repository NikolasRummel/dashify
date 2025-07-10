import { WidgetCategory } from "@/types/dashboard";
import MapSmall from "./small";
import { LuMapPin } from "react-icons/lu";

export const mapWidgets: WidgetCategory = {
	type: "MAP",
	title: "Map",
	icon: <LuMapPin />,
	color: "#FD393E",
	widgets: [
		{
			title: "Small Map Widget",
			description: "Displays the current location.",
			w: 1,
			h: 1,
			component: <MapSmall />,
		},
	],
};
