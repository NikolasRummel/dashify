import { CreateRecipeDto, Recipe, UpdateRecipeDto } from "@/types/recipe";
import axiosInstance from "./axios";

/**
 * Creates a new recipe.
 * @param recipe - The recipe data to create
 * @returns A promise that resolves to the created recipe
 * @throws Will throw an error if the request fails
 */
export async function createRecipe(recipe: CreateRecipeDto) {
	try {
		return await axiosInstance.post<Recipe>("/api/recipes", recipe);
	} catch (error) {
		throw error;
	}
}

/**
 * Retrieves a specific recipe by its ID.
 * @param id - The ID of the recipe to retrieve
 * @returns A promise that resolves to the recipe data
 * @throws Will throw an error if the request fails
 */
export async function getRecipe(id: number) {
	try {
		const response = await axiosInstance.get<Recipe>(`/api/recipes/${id}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

/**
 * Retrieves all public recipes.
 * @returns A promise that resolves to an array of public recipes
 * @throws Will throw an error if the request fails
 */
export async function getPublicRecipes() {
	try {
		const response =
			await axiosInstance.get<Recipe[]>(`/api/recipes/public`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

/**
 * Retrieves all private recipes for the current user.
 * @returns A promise that resolves to an array of private recipes
 * @throws Will throw an error if the request fails
 */
export async function getPrivateRecipes() {
	try {
		const response = await axiosInstance.get<Recipe[]>(`/api/recipes/my`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

/**
 * Updates an existing recipe.
 * @param id - The ID of the recipe to update
 * @param update - The updated recipe data
 * @returns A promise that resolves to the updated recipe
 * @throws Will throw an error if the request fails
 */
export async function updateRecipe(id: number, update: UpdateRecipeDto) {
	try {
		return await axiosInstance.put<Recipe>(`/api/recipes/${id}`, update);
	} catch (error) {
		throw error;
	}
}

/**
 * Deletes a recipe by its ID.
 * @param id - The ID of the recipe to delete
 * @returns A promise that resolves when the recipe is deleted
 * @throws Will throw an error if the request fails
 */
export async function deleteRecipe(id: number) {
	try {
		return await axiosInstance.delete(`/api/recipes/${id}`);
	} catch (error) {
		throw error;
	}
}

/**
 * Creates a duplicate of an existing recipe.
 * @param id - The ID of the recipe to duplicate
 * @returns A promise that resolves to the duplicated recipe
 * @throws Will throw an error if the request fails
 */
export async function duplicateRecipe(id: number) {
	try {
		return await axiosInstance.post<Recipe>(`/api/recipes/${id}/duplicate`);
	} catch (error) {
		throw error;
	}
}

/**
 * Searches for recipes based on a query string.
 * @param query - The search query
 * @param privateOnly - Whether to search only private recipes
 * @returns A promise that resolves to an array of matching recipes
 * @throws Will throw an error if the request fails
 */
export async function searchRecipes(
	query: string,
	privateOnly = false,
): Promise<Recipe[]> {
	try {
		const response = await axiosInstance.get("/api/recipes/search", {
			params: { query, privateOnly },
		});
		return response.data;
	} catch (error) {
		console.error("Error searching recipes:", error);
		throw error;
	}
}

/**
 * Retrieves a random recipe.
 * Used for the recipe widget.
 * @returns A promise that resolves to a random recipe
 * @throws Will throw an error if the request fails
 */
export async function getRandomRecipe(): Promise<Recipe> {
	try {
		const response = await axiosInstance.get("/api/widgets/recipe/random");
		return response.data;
	} catch (error) {
		console.error("Error fetching random recipe:", error);
		throw error;
	}
}

/**
 * Retrieves recipe suggestions based on a search query.
 * Returns only recipe IDs and titles for quick suggestions.
 * @param query - The search query
 * @param privateOnly - Whether to search only private recipes
 * @returns A promise that resolves to an array of recipe suggestions
 * @throws Will throw an error if the request fails
 */
export async function suggestRecipes(
	query: string,
	privateOnly = false,
): Promise<{ id: number; title: string }[]> {
	try {
		const response = await axiosInstance.get(
			"/api/recipes/search/suggestions",
			{
				params: { query, privateOnly },
			},
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching recipe suggestions:", error);
		throw error;
	}
}

/**
 * Generates a recipe based on a search query.
 * @param query - The search query
 * @returns A promise that resolves to the generated recipe
 * @throws Will throw an error if the request fails
 */
export async function generateRecipe(query: string) {
	try {
		const response = await axiosInstance.get("/api/ai/recipes", {
			params: { query },
		});
		return response.data;
	} catch (error) {
		console.error("Error generating recipe:", error);
		throw error;
	}
}
