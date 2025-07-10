import { getPrivateRecipes, getPublicRecipes } from "@/lib/api/recipe";
import { Recipe } from "@/types/recipe";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AddRecipeDialog } from "./add-recipe-dialog";
import SearchBarWithResults from "./recipe-searchbar";

interface RecipeTabsProps {
	onTabChange?: (tab: string) => void;
	activeTab?: string;
	onRecipesChange: (recipes: Recipe[]) => void;
}

const RecipeTabs: React.FC<RecipeTabsProps> = ({
	onTabChange,
	activeTab: initialTab,
	onRecipesChange,
}) => {
	const [activeTab, setActiveTab] = useState<string>(
		initialTab || "My recipes",
	);
	const [searchMode, setSearchMode] = useState(false);

	useEffect(() => {
		if (!searchMode) {
			handleTabChange(activeTab);
		}
	}, [searchMode]);

	const handleTabChange = async (tab: string) => {
		setActiveTab(tab);
		if (onTabChange) onTabChange(tab);

		if (tab === "My recipes") {
			const recipes = await getPrivateRecipes();
			onRecipesChange(recipes);
		} else if (tab === "Shared with me") {
			onRecipesChange([]);
		} else if (tab === "Explore") {
			const recipes = await getPublicRecipes();
			onRecipesChange(recipes);
		}
	};

	return (
		<div className="flex w-full flex-col items-center gap-4 p-4 text-white">
			<div className="flex items-center space-x-4">
				<button
					className="rounded-full bg-[#1a1a1a] p-3"
					onClick={() => setSearchMode((prev) => !prev)}
				>
					{searchMode ? (
						<X className="h-5 w-5 text-white" />
					) : (
						<Search className="h-5 w-5 text-white" />
					)}
				</button>

				{!searchMode && (
					<>
						<div className="flex overflow-hidden rounded-full bg-[#1a1a1a]">
							{["My recipes", "Shared with me", "Explore"].map(
								(tab) => (
									<button
										key={tab}
										onClick={() => handleTabChange(tab)}
										className={`px-5 py-3 text-sm font-medium transition-colors duration-200 ${
											activeTab === tab
												? "bg-[#2a2a2a] text-white"
												: "text-gray-400 hover:text-white"
										}`}
									>
										{tab}
									</button>
								),
							)}
						</div>

						<AddRecipeDialog />
					</>
				)}
			</div>
			{searchMode && (
				<SearchBarWithResults
					onSearchResults={(results) => onRecipesChange(results)}
					privateOnly={activeTab == "My recipes"}
				/>
			)}
		</div>
	);
};

export default RecipeTabs;
