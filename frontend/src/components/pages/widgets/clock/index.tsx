import { WidgetCategory } from "@/types/dashboard";
import ClockSmall from "./small";
import { LuWatch } from "react-icons/lu";

export const clockWidgets: WidgetCategory = {
	type: "CLOCK",
	title: "Clock",
	icon: <LuWatch />,
	color: "#FD393E",
	widgets: [
		{
			title: "Small Clock Widget",
			description: "Displays the current time.",
			w: 1,
			h: 1,
			component: <ClockSmall />,
		},
	],
};
