import { WidgetCategory } from "@/types/dashboard";
import { IoBatteryCharging } from "react-icons/io5";
import BatterySmall from "./small";

export const batteryWidgets: WidgetCategory = {
	type: "BATTERY",
	title: "Battery",
	icon: <IoBatteryCharging />,
	color: "#6BBA46",
	widgets: [
		{
			title: "Battery Status",
			description:
				"Displays the current battery percentage and status. (Chrome only)",
			w: 1,
			h: 1,
			component: <BatterySmall />,
		},
	],
};
