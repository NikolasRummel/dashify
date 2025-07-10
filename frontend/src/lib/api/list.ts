import { List, ListItem } from "@/types/list";
import axiosInstance from "./axios";

export async function getLists(): Promise<List> {
	try {
		const response = await axiosInstance.get("/api/lists/1", {
			headers: {
				Accept: "application/json",
			},
		});
		return response.data.body;
	} catch (error) {
		console.error("Error fetching list:", error);
		throw error;
	}
}

export async function getAllLists(): Promise<List[]> {
	try {
		const response = await axiosInstance.get("/api/lists/all", {
			headers: {
				Accept: "application/json",
			},
		});
		return (response.data || []).map((list: List) => ({
			...list,
			items: list.items || [],
		}));
	} catch (error) {
		console.error("Error fetching list:", error);
		throw error;
	}
}

export async function updateListItem(listItem: ListItem): Promise<ListItem> {
	try {
		const response = await axiosInstance.put(
			`/api/lists/items/${listItem.id}`,
			listItem,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			},
		);
		return response.data.body;
	} catch (error) {
		console.error("Error updating list item:", error);
		throw error;
	}
}

export async function addListItem(item: {
	text: string;
	done: boolean;
	list_id: number;
	deadline: string;
}): Promise<ListItem> {
	try {
		const requestBody = {
			text: item.text,
			done: item.done,
			listId: item.list_id,
			deadline: item.deadline,
		};
		const response = await axiosInstance.post(
			"/api/lists/items",
			requestBody,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			},
		);
		return response.data.body;
	} catch (error) {
		console.error("Error adding list item:", error);
		throw error;
	}
}

export async function createList(list: {
	name: string;
	type: string;
	icon: string;
}): Promise<List> {
	try {
		const response = await axiosInstance.post("/api/lists", list, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
		const createdList = response.data.body || response.data;
		return {
			...createdList,
			items: createdList.items || [],
		};
	} catch (error) {
		console.error("Error creating list:", error);
		throw error;
	}
}

export async function deleteList(listId: number): Promise<void> {
	try {
		await axiosInstance.delete(`/api/lists/${listId}`, {
			headers: {
				Accept: "application/json",
			},
		});
	} catch (error) {
		console.error("Error deleting list:", error);
		throw error;
	}
}

export async function deleteListItem(itemId: number): Promise<void> {
	try {
		await axiosInstance.delete(`/api/lists/items/${itemId}`, {
			headers: {
				Accept: "application/json",
			},
		});
	} catch (error) {
		console.error("Error deleting list item:", error);
		throw error;
	}
}

export async function updateList(listId: number, list: List): Promise<List> {
	console.log("Updating list:", list);
	try {
		const response = await axiosInstance.put(`/api/lists/${listId}`, list, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
		const updatedList = response.data.body || response.data;
		return {
			...updatedList,
			items: updatedList.items || [],
		};
	} catch (error) {
		console.error("Error updating list:", error);
		throw error;
	}
}
