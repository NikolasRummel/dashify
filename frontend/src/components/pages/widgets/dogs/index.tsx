import { WidgetCategory } from "@/types/dashboard";
import { LuDog } from "react-icons/lu";
import DogWidget from "./dog";

export const dogsWidgets: WidgetCategory = {
	type: "DOG",
	title: "Dogs",
	icon: <LuDog />,
	color: "#FFB829",
	widgets: [
		{
			title: "Small Dog Image",
			description: "Displays a random dog image.",
			w: 1,
			h: 1,
			component: <DogWidget />,
		},
		{
			title: "Medium Dog Image",
			description: "Displays a random dog image.",
			w: 2,
			h: 1,
			component: <DogWidget />,
		},
		{
			title: "Large Dog Image",
			description: "Displays a random dog image.",
			w: 2,
			h: 2,
			component: <DogWidget />,
		},
	],
};
