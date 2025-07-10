import { WidgetCategory } from "@/types/dashboard";
import { LuCat } from "react-icons/lu";
import CatWidget from "./cat";

export const catsWidgets: WidgetCategory = {
	type: "CAT",
	title: "Cats",
	icon: <LuCat />,
	color: "#FF801A",
	widgets: [
		{
			title: "Small Cat Image",
			description: "Displays a random cat image.",
			w: 1,
			h: 1,
			component: <CatWidget />,
		},
		{
			title: "Medium Cat Image",
			description: "Displays a random cat image.",
			w: 2,
			h: 1,
			component: <CatWidget />,
		},
		{
			title: "Large Cat Image",
			description: "Displays a random cat image.",
			w: 2,
			h: 2,
			component: <CatWidget />,
		},
	],
};
