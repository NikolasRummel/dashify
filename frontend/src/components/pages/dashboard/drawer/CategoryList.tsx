import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { IoSearch } from "react-icons/io5";
import { widgetCategories } from "../../widgets";
import { MdOutlineWidgets } from "react-icons/md";
import CategoryEntry from "./CategoryEntry";

export default function CategoryList() {
	return (
		<div className="border-primary/10 flex w-fit flex-col gap-2 border-r px-2 pt-4">
			<div className="px-2">
				<Input
					placeholder="Search Widgets"
					className="placeholder:text-primary/40 border-primary/10 w-48 pl-7"
					icon={<IoSearch size={14} />}
					alignIcon="start"
				/>
			</div>
			<ScrollArea className="w-full">
				<div className="flex w-full flex-col gap-0.5 p-1">
					<CategoryEntry
						category={{
							color: "#000000",
							icon: <MdOutlineWidgets size={14} />,
							title: "All Widgets",
							type: "all-widgets",
							widgets: [],
						}}
					/>
					{widgetCategories.map((category) => (
						<CategoryEntry
							key={category.title}
							category={category}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
