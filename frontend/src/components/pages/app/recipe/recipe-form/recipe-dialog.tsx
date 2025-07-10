"use client";

import { RecipeForm } from "@/components/pages/recipe/recipe-form/recipe-form";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/use-session";
import { createRecipe, deleteRecipe, updateRecipe } from "@/lib/api/recipe";
import {
	CreateRecipeDto,
	RecipeFormValues,
	UpdateRecipeDto,
} from "@/types/recipe";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface RecipeDialogProps {
	id?: number;
	userId?: number;
	initialRecipe?: RecipeFormValues;
}

export const ModifyRecipeMenu = ({
	id,
	userId,
	initialRecipe,
}: RecipeDialogProps) => {
	const [dialogMode, setDialogMode] = useState<
		"create" | "update" | "duplicate" | null
	>(null);

	const router = useRouter();
	const session = useSession();

	function isUserOwner() {
		return session.user?.id == userId;
	}

	const handleSubmit = async (values: RecipeFormValues) => {
		try {
			if (dialogMode === "create" || dialogMode === "duplicate") {
				const payload: CreateRecipeDto = {
					...values,
					instructions: values.instructions,
					ingredients: values.ingredients.map((ingredient) => ({
						...ingredient,
						amount: Number(ingredient.amount),
					})),
				};
				const response = await createRecipe(payload);
				toast.success(
					dialogMode === "create"
						? "Recipe created successfully!"
						: "Recipe duplicated successfully!",
				);

				router.push(`/app/recipes/${response.data.id}`);
			} else if (dialogMode === "update") {
				if (!id) {
					throw new Error("Missing recipe ID for update.");
				}
				const payload: UpdateRecipeDto = {
					id,
					...values,
					instructions: values.instructions,
					ingredients: values.ingredients.map((ingredient) => ({
						...ingredient,
						amount: Number(ingredient.amount),
					})),
				};
				await updateRecipe(payload.id, payload);
				toast.success("Recipe updated successfully!");
			}
		} catch (err) {
			toast.error("Failed to process recipe.");
			console.error(err);
		} finally {
			setDialogMode(null); // Close dialog after submit
		}
	};

	return (
		<div className="flex items-center gap-2">
			{/* Main dropdown menu */}
			<DropdownMenu>
				<DropdownMenuTrigger onClick={(e) => e.preventDefault()}>
					<DotsVerticalIcon className="w-4 h-4" />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{isUserOwner() && (
						<DropdownMenuItem
							className="flex items-center gap-2"
							onClick={() => setDialogMode("update")}
						>
							<Pencil className="w-4 h-4" />
							Edit
						</DropdownMenuItem>
					)}

					<DropdownMenuItem
						className="flex items-center gap-2"
						onClick={() => setDialogMode("duplicate")}
					>
						<Copy className="w-4 h-4" />
						{isUserOwner() ? "Duplicate" : "Copy in own Cookbook"}
					</DropdownMenuItem>

					{isUserOwner() && (
						<>
							<DropdownMenuSeparator />

							<DropdownMenuItem
								className="flex items-center gap-2 text-red-500"
								onClick={async () => {
									try {
										if (!id) {
											throw new Error(
												"Missing recipe ID for deletion.",
											);
										}
										await deleteRecipe(id);
										toast.success(
											"Recipe deleted successfully!",
										);
										router.push(`/app/recipes`);
									} catch (err) {
										toast.error("Failed to delete recipe.");
										console.error(err);
									}
								}}
							>
								<Trash2 className="w-4 h-4" />
								Delete
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{dialogMode && (
				<Dialog
					open
					onOpenChange={() => setDialogMode(null)}
				>
					<DialogContent className="max-h-[90%] overflow-y-auto dark:bg-[#1a1a1a]">
						<div className="space-y-4">
							<DialogHeader>
								<DialogTitle>
									{dialogMode === "create" &&
										"Add New Recipe"}
									{dialogMode === "update" && "Edit Recipe"}
									{dialogMode === "duplicate" &&
										"Duplicate Recipe"}
								</DialogTitle>
							</DialogHeader>

							<RecipeForm
								initialValues={initialRecipe}
								handleSubmitAction={handleSubmit}
							/>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
};

export default ModifyRecipeMenu;
