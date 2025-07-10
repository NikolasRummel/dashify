import { LuPalette } from "react-icons/lu";
import { type SettingsMenu } from "..";
import AccentAndWallpaperColorSettings from "./accent-color-and-wallpaper";
import DarkModeSettings from "./dark-mode";

export const appearance: SettingsMenu = {
	id: "appearance",
	label: "Appearance",
	icon: <LuPalette size={16} />,
	title: "Appearance Settings",
	description: "Customize the Appearance of Dashify",
	sections: [
		{
			id: "dark-mode",
			title: "Light / Dark Mode",
			description:
				"Switch between light and dark mode, or follow the system theme.",
			component: <DarkModeSettings />,
		},
		{
			id: "accent-color-and-wallpaper",
			title: "Accent Color & Wallpaper",
			description:
				"Choose your preferred accent color and wallpaper for the dashboard.",
			component: <AccentAndWallpaperColorSettings />,
		},
	],
};
