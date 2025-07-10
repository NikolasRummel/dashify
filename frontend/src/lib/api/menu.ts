import axios from "axios";

export type MenuDaysReponse = {
	"iso-date": string;
	categories: {
		name: string;
		meals: {
			name: string;
			description: string;
		}[];
	};
};

export function getMenuForToday(): Promise<MenuDaysReponse["categories"][]> {
	const MENSA_ID = "kae4";

	return axios
		.get(
			`https://app.imensa.de/api/11101/de.imensa.app.android/${MENSA_ID}.json`,
		)
		.then((response) => {
			const data = response.data;
			// Get the menu for today
			const todaysMenu = data.days.find(
				(day: MenuDaysReponse) =>
					day["iso-date"] === new Date().toISOString().split("T")[0],
			);
			return todaysMenu.categories;
		});
}
