import { widgetCategories } from "@/components/pages/widgets";
import { Dashboard, WidgetCategory } from "@/types/dashboard";
import { atom } from "jotai";

/**
 * Global state atoms for dashboard management.
 * These atoms are used to manage various aspects of the dashboard UI and functionality.
 */

// Pages
/**
 * Stores the list of all dashboards.
 * Used for managing multiple dashboards in the application.
 */
export const dashboardsState = atom<Dashboard[]>([]);

/**
 * Tracks the currently selected dashboard page.
 * Used for pagination in the dashboard list.
 */
export const dashboardCurrentPageState = atom<number>(0);

/**
 * Indicates the current action being performed on dashboards.
 * Can be 'create', 'delete', 'edit', or null.
 */
export const dashboardPageIndicatorState = atom<
	"create" | "delete" | "edit" | "share" | null
>(null);

// Widgets
/**
 * Tracks whether the dashboard is in edit mode.
 * Controls the ability to move and configure widgets.
 */
export const dashboardIsEditingState = atom<boolean>(false);

// Avatar Modal
/**
 * Controls the visibility of the user avatar modal.
 * Used for profile picture management.
 */
export const dashboardIsUserAvatarModalOpenState = atom<boolean>(false);

/**
 * Controls the visibility of the dashboard settings panel.
 * Used for general dashboard configuration.
 */
export const dashboardSettingsOpenState = atom<boolean>(false);

// App List
/**
 * Controls the visibility of the application list.
 * Used for quick access to different sections of the app.
 */
export const dashboardAppListIsOpenState = atom<boolean>(false);

// Widget Drawer
/**
 * Controls the visibility of the widget selection drawer.
 * Used for adding new widgets to the dashboard.
 */
export const dashboardIsWidgetDrawerOpenState = atom<boolean>(false);

/**
 * Stores the currently selected widget category in the drawer.
 * Initialized with the first category from widgetCategories.
 */
export const dashboardWidgetDrawerCategoryState = atom<WidgetCategory>(
	widgetCategories[0],
);

// Background
/**
 * Controls the visibility of the background picker modal.
 * Used for changing the dashboard background.
 */
export const dashboardBackgroundPickerOpenState = atom<boolean>(false);

/**
 * Stores the current dashboard background image URL.
 * Used for persisting the selected background.
 */
export const dashboardBackgroundState = atom<string>();
