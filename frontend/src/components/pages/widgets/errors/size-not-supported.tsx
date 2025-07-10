import { WidgetCategory, WidgetType } from "@/types/dashboard";
import { ImBlocked } from "react-icons/im";

export function WidgetSizeNotSupportedError({
	category,
	widget,
}: {
	category: WidgetCategory;
	widget?: WidgetType;
}) {
	return (
		<div className="flex size-full flex-col items-center justify-center gap-4 text-center">
			<ImBlocked
				className={`text-6xl text-widget-accent/50 saturate-200 ${(widget?.h ?? 0) > 1 ? "visible" : "hidden"}`}
			/>
			<div>
				<h1 className="text-sm text-black/70 dark:text-white/70">
					Not supported
				</h1>
				<p className="text-xs font-normal text-balance w-44 text-primary/50">
					<b className="text-primary/60">{category.title}</b> is
					available in the following sizes:
				</p>
				<ul className="mt-2 flex flex-row justify-center gap-2">
					{category.widgets.map((widget) => (
						<div
							key={`${category.type}-${widget.w}-${widget.h}`}
							style={{
								width: `${widget.w * 24}px`,
								height: `${widget.h * 24}px`,
							}}
							className="flex items-center justify-center rounded-sm bg-widget-accent/40 text-xs text-black/30 dark:text-white/40"
						>
							{widget.w}x{widget.h}
						</div>
					))}
				</ul>
			</div>
		</div>
	);
}
