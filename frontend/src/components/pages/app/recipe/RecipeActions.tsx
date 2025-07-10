import {
	recipeFormDialogOpenState,
	recipesNavigationAtom,
	selectedRecipeAtom,
} from "@/atoms/recipes";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteRecipe, duplicateRecipe } from "@/lib/api/recipe";
import { useAtom, useSetAtom } from "jotai";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";

interface RecipeActionsProps {
	isUserRecipeCreator?: boolean;
}

export default function RecipeActions({
	isUserRecipeCreator,
}: RecipeActionsProps) {
	const setRecipeFormOpen = useSetAtom(recipeFormDialogOpenState);
	const [selectedRecipe, setSelectedRecipe] = useAtom(selectedRecipeAtom);
	const setSelectedTab = useSetAtom(recipesNavigationAtom);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
				>
					<BsThreeDots />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				alignOffset={8}
			>
				{isUserRecipeCreator && (
					<DropdownMenuItem
						className="flex items-center gap-2"
						onClick={() => setRecipeFormOpen(true)}
					>
						<Pencil className="w-4 h-4" />
						Edit
					</DropdownMenuItem>
				)}

				<DropdownMenuItem
					className="flex items-center gap-2"
					onClick={() => {
						if (!selectedRecipe) return;
						duplicateRecipe(selectedRecipe.id)
							.then((response) => response.data)
							.then((recipe) => {
								setSelectedRecipe(recipe);
							})
							.catch((error) => {
								console.error(error);
							});
					}}
				>
					<Copy className="w-4 h-4" />
					Duplicate
				</DropdownMenuItem>

				{isUserRecipeCreator && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="flex items-center gap-2 text-red-500"
							onClick={() => {
								if (!selectedRecipe) return;
								deleteRecipe(selectedRecipe.id);
								setSelectedTab("tab-my-recipes");
							}}
						>
							<Trash2 className="w-4 h-4" />
							Delete
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
