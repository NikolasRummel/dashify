import { type SettingsMenu } from "..";
import DeleteAccountSettings from "./delete-account";
import ChangeProfilePictureSettings from "./profile-picture";
import { LuUserCog } from "react-icons/lu";

export const profileAndLogin: SettingsMenu = {
	id: "profile-and-login",
	label: "Profile & Login",
	icon: <LuUserCog size={16} />,
	title: "Profile & Login Settings",
	description: "Manage your Profile and Login settings.",
	sections: [
		{
			id: "profile-picture",
			title: "Change Profile Picture",
			description: "Upload a new profile picture for your account.",
			component: <ChangeProfilePictureSettings />,
		},
		{
			id: "delete-account",
			title: "Delete Account",
			description: "Permanently delete your Dashify account.",
			component: <DeleteAccountSettings />,
		},
	],
};
