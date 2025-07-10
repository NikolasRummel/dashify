import { WidgetType } from "@/types/dashboard";
import { GridItemHTMLElement, GridStack } from "gridstack";
import { useState, useContext, createContext } from "react";

type GridContextType = {
	// GridStack
	gridStack: GridStack | null;
	setGridStack: React.Dispatch<React.SetStateAction<GridStack | null>>;
	// Widget refs
	widgetContainers: Map<string, HTMLElement>;
	setWidgetContainers: React.Dispatch<
		React.SetStateAction<Map<string, GridItemHTMLElement>>
	>;
	// Items
	items: WidgetType[];
	setItems: React.Dispatch<React.SetStateAction<WidgetType[]>>;
};

export const GridContext = createContext<GridContextType | undefined>(
	undefined,
);

export function GridContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [gridStack, setGridStack] = useState<GridStack | null>(null);
	const [widgetContainers, setWidgetContainers] = useState<
		Map<string, HTMLElement>
	>(new Map());
	const [items, setItems] = useState<WidgetType[]>([]);

	return (
		<GridContext.Provider
			value={{
				gridStack,
				setGridStack,
				widgetContainers,
				setWidgetContainers,
				items,
				setItems,
			}}
		>
			{children}
		</GridContext.Provider>
	);
}

export function useGridContext() {
	const ctx = useContext(GridContext);
	if (!ctx)
		throw new Error("useGridStack must be used within <GridStackProvider>");

	return ctx;
}
