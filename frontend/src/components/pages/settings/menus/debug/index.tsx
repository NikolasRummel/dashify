import { type SettingsMenu } from "..";
import SessionDisplay from "./session-display";
import { LuBug } from "react-icons/lu";

export const debug: SettingsMenu = {
	id: "debug",
	label: "Debug",
	icon: <LuBug size={16} />,
	title: "Debug Settings",
	description: "Get debug information.",
	sections: [
		{
			id: "session-display",
			title: "Session",
			description: "Displays the current session information.",
			component: <SessionDisplay />,
		},
	],
};
