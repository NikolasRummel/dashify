import { Recipe } from "@/types/recipe";
import { atom } from "jotai";

export const recipeAppDrawerOpenState = atom<boolean>(false);

export type RecipeNavigationState =
	| "tab-explore"
	| "tab-my-recipes"
	| "tab-shared-with-me"
	| "display-recipe"
	| "search";

export const recipesNavigationAtom =
	atom<RecipeNavigationState>("tab-my-recipes");

export const recipeFormDialogOpenState = atom<boolean>(false);

export const selectedRecipeAtom = atom<Recipe | null>(null);

export const searchResultsAtom = atom<Recipe[]>([]);

export const aiDialogOpenState = atom<boolean>(false);
