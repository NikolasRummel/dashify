/**
 * Represents a user's dashboard configuration.
 * Contains layout information and a list of configured widgets.
 */
export type Dashboard = {
	id: number;
	userId: number;
	name: string;
	width: number;
	height: number;
	widgets: WidgetType[];
};

/**
 * Base type for all widgets in the system.
 * Defines common properties that every widget must have.
 */
export type BaseWidget = {
	w: number;
	h: number;
	type: string;
	config: Record<string, unknown>;
};

/**
 * Represents a widget instance in a dashboard.
 * Extends BaseWidget with positioning information.
 */
export type WidgetType = BaseWidget & {
	id: string;
	x: number;
	y: number;
};

/**
 * Represents a widget as it appears in the widget selection menu.
 * Contains metadata and the actual widget component.
 */
export type WidgetInCategory = {
	title: string;
	description: string;
	w: number;
	h: number;
	component: React.ReactNode;
};

/**
 * Represents a category of widgets in the widget selection menu.
 * Groups related widgets together with a common theme and icon.
 */
export type WidgetCategory = {
	type: string;
	title: string;
	icon: React.ReactNode;
	color: string;
	widgets: WidgetInCategory[];
};
