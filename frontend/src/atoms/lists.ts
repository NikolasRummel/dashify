import { List } from "@/types/list";
import { atom } from "jotai";

export type ListType = "Todo" | "Shopping";

// UI State
export const listsDrawerOpenAtom = atom<boolean>(false);
export const activeListTypeAtom = atom<ListType>("Todo");
export const searchQueryAtom = atom("");
export const isSearchingAtom = atom(false);

// Data State
export const allListsAtom = atom<List[]>([]);
export const selectedListAtom = atom<List | null>(null);
export const filterModeAtom = atom<string | null>("All items");
export const updateListAtom = atom(0);

// Derived atoms
export const filteredListsAtom = atom((get) => {
	const allLists = get(allListsAtom);
	const activeType = get(activeListTypeAtom);
	return allLists
		.filter((list) => list.type === activeType.toUpperCase())
		.sort((a, b) => a.id - b.id); // Sort by ID ascending (oldest first)
});

export const searchResultsAtom = atom((get) => {
	const filteredLists = get(filteredListsAtom);
	const searchQuery = get(searchQueryAtom);
	const selectedList = get(selectedListAtom);
	const filterMode = get(filterModeAtom);

	if (searchQuery.trim()) {
		// Search mode: filter items by text across all lists
		return filteredLists
			.map((list) => ({
				...list,
				items: list.items.filter(
					(item) =>
						typeof item.text === "string" &&
						item.text
							.toLowerCase()
							.includes(searchQuery.trim().toLowerCase()),
				),
			}))
			.filter((list) => list.items.length > 0);
	}

	if (selectedList) {
		// Single list view
		const currentList = filteredLists.find((l) => l.id === selectedList.id);
		if (!currentList) return [];

		return [
			{
				...currentList,
				items: [...currentList.items].sort((a, b) => {
					if (a.done === b.done) {
						if (a.deadline && b.deadline) {
							return (
								new Date(a.deadline).getTime() -
								new Date(b.deadline).getTime()
							);
						}
						if (a.deadline) return -1;
						if (b.deadline) return 1;
						return 0;
					}
					return a.done ? 1 : -1;
				}),
			},
		];
	}

	// Filter mode: show all lists with filtered items
	return filteredLists
		.map((list) => {
			const filteredItems = list.items
				.filter((item) => {
					switch (filterMode) {
						case "Completed":
							return item.done;
						case "Uncompleted":
							return !item.done;
						case "Scheduled":
							return !!item.deadline;
						default:
							return true;
					}
				})
				.sort((a, b) => {
					if (a.done === b.done) {
						if (a.deadline && b.deadline) {
							return (
								new Date(a.deadline).getTime() -
								new Date(b.deadline).getTime()
							);
						}
						if (a.deadline) return -1;
						if (b.deadline) return 1;
						return 0;
					}
					return a.done ? 1 : -1;
				});
			return {
				...list,
				items: filteredItems,
			};
		})
		.filter((list) => list.items.length > 0);
});

export const statsAtom = atom((get) => {
	const filteredLists = get(filteredListsAtom);
	const allItems = filteredLists.flatMap((list) => list.items);

	return {
		total: allItems.length,
		completed: allItems.filter((item) => item.done).length,
		uncompleted: allItems.filter((item) => !item.done).length,
		scheduled: allItems.filter((item) => !!item.deadline).length,
	};
});
