import "gridstack/dist/gridstack.min.css";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	GridStack,
	GridStackNode,
	GridStackOptions,
	GridStackWidget,
	GridItemHTMLElement,
} from "gridstack";
import { GridStackItem } from "@/components/pages/dashboard/gridstack/grid-stack-item";
import { GridContext } from "@/components/pages/dashboard/gridstack/grid-context-provider";
import { useAtomValue } from "jotai";
import { dashboardIsEditingState } from "@/atoms/dashboard";
import { saveDashboard } from "@/lib/api/dashboard";
import { v4 as uuidv4 } from "uuid";
import { Dashboard, WidgetType } from "@/types/dashboard";

// Define allowed widget sizes
const WIDGET_SIZES = [
	{ w: 1, h: 1 },
	{ w: 2, h: 1 },
	{ w: 2, h: 2 },
];

// Interface for tracking resize state
interface ExtendedGridStackNode extends GridStackNode {
	_beforeDrag?: {
		w: number;
		h: number;
		x: number;
		y: number;
	};
}

export function GridStackGrid({
	dashboard,
	isCurrentlyVisible,
}: {
	dashboard: Dashboard;
	isCurrentlyVisible: boolean;
}) {
	const [gridStack, setGridStack] = useState<GridStack | null>(null);
	const [widgetContainers, setWidgetContainers] = useState<
		Map<string, HTMLElement>
	>(new Map());
	const widgets = dashboard.widgets;
	const [items, setItems] = useState(widgets);
	const containerRef = useRef<HTMLDivElement>(null);
	const isEditing = useAtomValue(dashboardIsEditingState);

	const optionsRef = useRef<GridStackOptions>({
		float: true,
		column: dashboard.width,
		columnOpts: { columnMax: dashboard.width },
		margin: 6,
		row: dashboard.height,
		maxRow: dashboard.height,
		animate: true,
		staticGrid: !isEditing,
		resizable: { handles: "e, s, ne, se, sw" },
		acceptWidgets: ".grid-stack-drag-in",
		draggable: { scroll: false },
		children: items,
	});

	/*
	 * HELPER FUNCTIONS
	 */

	// Find the closest predefined size to the current dimensions
	const findClosestSize = (width: number, height: number) => {
		return WIDGET_SIZES.reduce((closest, size) => {
			const widthDiff = Math.abs(size.w - width);
			const heightDiff = Math.abs(size.h - height);
			const totalDiff = widthDiff + heightDiff;
			const closestTotalDiff =
				Math.abs(closest.w - width) + Math.abs(closest.h - height);

			if (totalDiff < closestTotalDiff) {
				return size;
			}
			if (totalDiff === closestTotalDiff) {
				return size.w * size.h > closest.w * closest.h ? size : closest;
			}
			return closest;
		}, WIDGET_SIZES[0]);
	};

	// Initialize gridstack function
	const initGrid = useCallback(() => {
		if (!containerRef.current) return null;

		GridStack.renderCB = (el: HTMLElement, widget: GridStackWidget) => {
			if (widget.id) {
				setWidgetContainers((prev) => {
					const updated = new Map(prev);
					updated.set(widget.id as string, el);
					return updated;
				});
			}
		};
		return GridStack.init(optionsRef.current, containerRef.current);
	}, [setWidgetContainers]);

	/*
	 * EFFECTS
	 */

	// Initialize gridstack on mount
	useLayoutEffect(() => {
		if (!gridStack) {
			try {
				setGridStack(initGrid());
			} catch (e) {
				console.error("Error initializing gridstack:", e);
			}
		}
	}, [gridStack, initGrid, setGridStack]);

	// Set editing mode
	useEffect(() => {
		if (!gridStack) return;
		gridStack.setStatic(!isEditing);
	}, [gridStack, isEditing]);

	// Save dashboard
	const prevEditingRef = useRef(isEditing);
	useEffect(() => {
		if (!isCurrentlyVisible) return;
		if (prevEditingRef.current && !isEditing) {
			console.log(`Saving dashboard ${dashboard.id}...`);
			saveDashboard(dashboard.id, items).then(() => {
				console.log("Dashboard saved successfully");
			});
		}

		prevEditingRef.current = isEditing;
	}, [items, isEditing, dashboard.id, isCurrentlyVisible]);

	// Sync items state -> gridstack
	useLayoutEffect(() => {
		if (!gridStack) return;
		gridStack.batchUpdate();

		// Remove
		gridStack.engine.nodes.forEach((node) => {
			if (node.el && !items.some((item) => item.id === node.id)) {
				gridStack.removeWidget(node.el);
			}
		});

		// Add or update
		items.forEach(({ id, x, y, w, h }) => {
			const node = gridStack.engine.nodes.find((n) => n.id === id);
			if (!node) {
				gridStack.addWidget({ id, x, y, w, h });
			} else if (node.el) {
				gridStack.update(node.el, { x, y, w, h });
			}
		});

		gridStack.commit();
	}, [items, gridStack]);

	// useEffect for gridstack events
	useEffect(() => {
		if (!gridStack) return;

		/*
		 * EVENT HANDLERS
		 */

		// Sync gridstack -> items state
		const handleChange = (
			_event: Event,
			changedItems: GridStackWidget[],
		) => {
			setItems((prev) => {
				const updates = new Map(
					changedItems.map(({ id, x, y, w, h }) => [
						id as string,
						{
							id: id as string,
							x: x ?? 0,
							y: y ?? 0,
							w: w ?? 1,
							h: h ?? 1,
						},
					]),
				);
				return prev.map((item) => {
					const updatedItem = updates.get(item.id);
					return updatedItem ? { ...item, ...updatedItem } : item;
				});
			});
		};

		// Handle dragging in new item
		const handleDropped = (
			_event: Event,
			_prev: GridStackNode,
			{ x, y, w, h, el }: GridStackNode,
		) => {
			document
				.querySelectorAll(".grid-stack-item.grid-stack-drag-in")
				.forEach((el) => el.remove());
			const type = el?.getAttribute("data-gs-type");
			if (!type) return;

			const config = JSON.parse(
				el?.getAttribute("data-gs-config") || "{}",
			);
			setItems((prev) => [
				...prev,
				{
					id: uuidv4(),
					type,
					config,
					x: x ?? 0,
					y: y ?? 0,
					w: w ?? 1,
					h: h ?? 1,
				},
			]);
		};

		// Handle resize start - store original dimensions
		const handleResizeStart = (_event: Event, el: GridItemHTMLElement) => {
			const node = el.gridstackNode as ExtendedGridStackNode;
			if (!node) return;

			// Store the original dimensions before resize starts
			node._beforeDrag = {
				w: node.w || 1,
				h: node.h || 1,
				x: node.x || 0,
				y: node.y || 0,
			};
		};

		// Handle resize stop - enforce predefined sizes
		const handleResizeStop = (_event: Event, el: GridItemHTMLElement) => {
			const node = el.gridstackNode as ExtendedGridStackNode;
			if (!node) return;

			const newW = node.w || 1;
			const newH = node.h || 1;
			const closestSize = findClosestSize(newW, newH);
			const isShrinking =
				closestSize.w <= (node.w || 1) &&
				closestSize.h <= (node.h || 1);

			if (isShrinking) {
				gridStack.update(el, { w: closestSize.w, h: closestSize.h });
			} else {
				// Only allow enlarging if the area is empty
				if (
					gridStack.isAreaEmpty(
						node.x!,
						node.y!,
						closestSize.w,
						closestSize.h,
					) ||
					(node.w === closestSize.w && node.h === closestSize.h)
				) {
					gridStack.update(el, {
						w: closestSize.w,
						h: closestSize.h,
					});
				} else {
					// Reset to previous size if area is not empty
					if (node._beforeDrag) {
						gridStack.update(el, {
							w: node._beforeDrag.w,
							h: node._beforeDrag.h,
							x: node._beforeDrag.x,
							y: node._beforeDrag.y,
						});
					}
				}
			}
		};

		// "added"-Event für neues Widget -> WidgetContainer aktualisieren
		const handleAdded = (_event: Event, newNodes: GridStackNode[]) => {
			setWidgetContainers((prev) => {
				const updated = new Map(prev);
				newNodes.forEach((node) => {
					if (node.id && node.el) {
						updated.set(
							node.id as string,
							node.el.getElementsByClassName(
								"grid-stack-item-content",
							)[0] as HTMLElement,
						);
					}
				});
				return updated;
			});
		};

		gridStack.on("added", handleAdded);
		gridStack.on("change", handleChange);
		gridStack.on("dropped", handleDropped);
		gridStack.on("resizestart", handleResizeStart);
		gridStack.on("resizestop", handleResizeStop);
	}, [gridStack, setItems, dashboard.id]);

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
			<div
				className={`size-full max-w-[800px] rounded-4xl border-2 xl:max-w-[875px] 2xl:max-w-[1200px] ${isEditing ? "border-white/10 bg-white/5" : "bg-transparent"} flex size-full items-center justify-center border-transparent p-4 transition-colors`}
			>
				<div ref={containerRef} className="size-full">
					{items.map((item: WidgetType) => (
						<GridStackItem key={item.id} widget={item} />
					))}
				</div>
			</div>
		</GridContext.Provider>
	);
}
