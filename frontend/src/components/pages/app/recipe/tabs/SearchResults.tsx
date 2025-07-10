import { searchResultsAtom } from "@/atoms/recipes";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAtomValue } from "jotai";
import AiPrompt from "../AiPrompt";
import RecipeCard from "../RecipeCard";

export default function SearchResults() {
	const results = useAtomValue(searchResultsAtom);

	return (
		<>
			<ScrollArea className="h-[70vh] px-4 pb-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
					{results.map((recipe) => (
						<RecipeCard
							key={recipe.id}
							recipe={recipe}
						/>
					))}
				</div>
				<ScrollBar />
				{results.length > 0 && <Separator className="my-8" />}
				<div className="flex justify-center items-center w-full">
					<AiPrompt />
				</div>
			</ScrollArea>
		</>
	);
}
