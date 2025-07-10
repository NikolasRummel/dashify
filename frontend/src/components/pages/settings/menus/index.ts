import { appearance } from "./appearance";
import { profileAndLogin } from "./profile-and-login";
import { debug } from "./debug";
import { languageAndRegion } from "./language-and-region";

export type SettingsMenu = {
	id: string;
	label: string | React.ReactNode;
	icon: React.ReactNode;
	title: React.ReactNode | string;
	description: React.ReactNode | string;
	sections: SettingsSection[];
};

export type SettingsSection = {
	id: string;
	title: string | React.ReactNode;
	description: string | React.ReactNode;
	component: React.ReactNode;
};

export const settingsMenus: SettingsMenu[] = [
	appearance,
	languageAndRegion,
	profileAndLogin,
	debug,
];
