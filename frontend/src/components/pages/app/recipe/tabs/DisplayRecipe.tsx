import { selectedRecipeAtom } from "@/atoms/recipes";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Ingredient } from "@/types/recipe";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { useAtomValue } from "jotai";
import Image from "next/image";

export default function DisplayRecipe() {
	const selectedRecipe = useAtomValue(selectedRecipeAtom);

	if (!selectedRecipe) return null;

	return (
		<ScrollArea className="h-[70vh] w-full p-4 -mt-4">
			<div className="w-full h-80 relative rounded-xl overflow-hidden">
				<Image
					src={selectedRecipe.image}
					alt={selectedRecipe.name}
					className="object-cover"
					fill
				/>
			</div>
			<div className="flex w-full h-full gap-8 mt-4">
				{/* Left Section */}
				<div className="w-full">
					{/* Info Section */}
					<div className="flex gap-2 text-sm mb-6 flex-wrap">
						<Badge className="text-xs">
							🍽️ {selectedRecipe.portions} Portion
							{selectedRecipe.portions > 1 && "s"}
						</Badge>
						<Badge className="text-xs">
							⏱️ {selectedRecipe.preparation || "—"} prep
						</Badge>
						<Badge className="text-xs">
							🔥 {selectedRecipe.calories} kcal
						</Badge>
						<Badge className="text-xs">
							💧 {selectedRecipe.fat}g Fat
						</Badge>
						<Badge className="text-xs">
							🥩 {selectedRecipe.protein}g Protein
						</Badge>
						<Badge className="text-xs">
							🍚 {selectedRecipe.carbohydrates}g Carbs
						</Badge>
					</div>
					<Separator className="my-4 h-[2px]" />
					{/* Preparation HTML */}
					<div className="prose prose-invert text-sm max-w-none mb-6">
						<h2 className="text-lg font-semibold mb-2">
							Preparation
						</h2>
						<div
							dangerouslySetInnerHTML={{
								__html: selectedRecipe.instructions || "—",
							}}
						/>
					</div>
				</div>

				<Separator
					orientation="vertical"
					className=" w-[2px] h-auto"
				/>

				<div className="w-[300px] shrink-0 space-y-4">
					{/* Ingredients */}
					<div>
						<h2 className="text-lg font-semibold mb-2">
							Ingredients
						</h2>
						<ul className="text-sm text-muted-foreground space-y-1">
							{selectedRecipe.ingredients?.map(
								(item: Ingredient) => (
									<li key={item.id}>
										• <b>{item.amount}</b> {item.unit}{" "}
										{item.name}
									</li>
								),
							)}
						</ul>
					</div>

					<button className="w-full mt-4 bg-white text-black py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition">
						+ Add to list
					</button>
				</div>
			</div>
			<Scrollbar
				className="hidden"
				orientation="vertical"
			/>
		</ScrollArea>
	);
}
