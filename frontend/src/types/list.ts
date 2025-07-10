export interface ListItem {
	id: number;
	text: string;
	done: boolean;
	deadline: string;
	list_id: number;
}

export interface List {
	user_id: number;
	id: number;
	name: string;
	type: string;
	icon: string;
	items: ListItem[];
}
