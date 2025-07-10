import { type SettingsMenu } from "..";
import { IoGlobeOutline } from "react-icons/io5";
import LanguageSettings from "./language";

export const languageAndRegion: SettingsMenu = {
	id: "language-and-region",
	label: "Language and Region",
	icon: <IoGlobeOutline size={16} />,
	title: "Language and Region Settings",
	description: "Manage language and region preferences.",
	sections: [
		{
			id: "language",
			title: "Language",
			description: "Select your preferred language.",
			component: <LanguageSettings />,
		},
	],
};
