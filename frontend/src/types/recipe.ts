import { z } from "zod";

/**
 * Represents a single ingredient in a recipe.
 * Contains the ingredient's name, amount, and unit of measurement.
 */
export interface Ingredient {
	id?: number;
	name: string;
	amount: number;
	unit: string;
}

/**
 * Represents a complete recipe in the system.
 * Contains all recipe details including nutritional information,
 * preparation instructions, and ingredient list.
 */
export interface Recipe {
	id: number;
	userId: number;
	name: string;
	image: string;
	description: string;
	instructions: string;
	portions: number;
	preparation: string;
	cookingTime: number;
	calories: number;
	fat: number;
	carbohydrates: number;
	protein: number;
	isPublic: boolean;
	ingredients: Ingredient[];
}

/**
 * Type for creating a new recipe.
 * Omits the id and userId fields as they are assigned by the system.
 */
export type CreateRecipeDto = Omit<Recipe, "id" | "userId">;

/**
 * Type for updating an existing recipe.
 * Omits the userId field as it cannot be changed.
 */
export type UpdateRecipeDto = Omit<Recipe, "userId">;

/**
 * Zod schema for validating recipe form data.
 * Enforces:
 * - Required fields (name, description, etc.)
 * - Valid image format (URL or base64)
 * - Positive numeric values for portions, cooking time, and nutritional info
 * - At least one ingredient
 */
export const recipeSchema = z.object({
	name: z.string().min(1, "Title is required"),

	// Accepts both image URLs and base64-encoded strings
	image: z
		.string()
		.refine(
			(val) => val.startsWith("data:image") || /^https?:\/\//.test(val),
			{ message: "Invalid image format" },
		),

	description: z.string().min(1, "Description is required"),
	instructions: z.string(),

	portions: z.coerce.number().min(1, "Must be at least 1 serving"),
	preparation: z.string().min(1, "Prep time is required"),
	cookingTime: z.coerce.number().min(1, "Cooking time must be positive"),

	calories: z.coerce.number().min(0),
	fat: z.coerce.number().min(0),
	carbohydrates: z.coerce.number().min(0),
	protein: z.coerce.number().min(0),

	isPublic: z.boolean(),

	ingredients: z
		.array(
			z.object({
				amount: z.coerce.number().min(0.01, "Amount is required"),
				unit: z.string().min(1, "Unit is required"),
				name: z.string().min(1, "Ingredient name is required"),
			}),
		)
		.min(1, "At least one ingredient is required"),
});

/**
 * Type inferred from the recipe schema.
 * Used for type-safe form handling in the UI.
 */
export type RecipeFormValues = z.infer<typeof recipeSchema>;

/**
 * Maps a Recipe object to form values.
 * Used when editing an existing recipe.
 */
export const mapRecipeToFormValues = (recipe: Recipe): RecipeFormValues => ({
	name: recipe.name,
	image: recipe.image,
	description: recipe.description,
	instructions: recipe.instructions,
	portions: recipe.portions,
	preparation: recipe.preparation,
	cookingTime: recipe.cookingTime,
	calories: recipe.calories,
	fat: recipe.fat,
	carbohydrates: recipe.carbohydrates,
	protein: recipe.protein,
	isPublic: recipe.isPublic,
	ingredients: recipe.ingredients.map((ingredient) => ({
		name: ingredient.name,
		amount: ingredient.amount,
		unit: ingredient.unit,
	})),
});
