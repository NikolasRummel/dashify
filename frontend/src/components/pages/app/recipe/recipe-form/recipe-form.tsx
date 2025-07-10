"use client";

import {
	recipeFormDialogOpenState,
	recipesNavigationAtom,
	selectedRecipeAtom,
} from "@/atoms/recipes";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createRecipe, updateRecipe } from "@/lib/api/recipe";
import { RecipeFormValues, recipeSchema } from "@/types/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import { Content } from "@tiptap/react";
import { useAtom, useSetAtom } from "jotai";
import { Globe, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { MinimalTiptapEditor } from "../minimal-tiptap";

export function RecipeForm() {
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [editorContent, setEditorContent] = useState<Content>("");
	const setOpenDrawer = useSetAtom(recipeFormDialogOpenState);
	const [selectedRecipe, setSelectedRecipe] = useAtom(selectedRecipeAtom);
	const setCurrentTab = useSetAtom(recipesNavigationAtom);

	const form = useForm<RecipeFormValues>({
		resolver: zodResolver(recipeSchema),
		defaultValues: selectedRecipe || {
			name: "",
			image: "",
			description: "",
			instructions: "",
			portions: 1,
			preparation: "10m",
			cookingTime: 1,
			calories: 0,
			fat: 0,
			carbohydrates: 0,
			protein: 0,
			isPublic: false,
			ingredients: [{ amount: 1, unit: "", name: "" }],
		},
	});

	const onInvalid = (errors: FieldErrors<RecipeFormValues>) => {
		console.error("Validation errors:", errors);
	};

	const {
		fields: ingredients,
		append,
		remove,
	} = useFieldArray({
		control: form.control,
		name: "ingredients",
	});

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64 = reader.result as string;
				setImagePreview(base64);
				form.setValue("image", base64);
			};
			reader.readAsDataURL(file);
		}
	};

	const onSubmit = async (values: RecipeFormValues) => {
		form.setValue("instructions", editorContent as string);
		console.log(values);

		if (!selectedRecipe) {
			createRecipe(values).then((response) => {
				setSelectedRecipe(response.data);
			});
		} else {
			updateRecipe(selectedRecipe.id, {
				...values,
				id: selectedRecipe.id,
			}).then((response) => {
				setSelectedRecipe(response.data);
			});
		}
		setOpenDrawer(false);
		setCurrentTab("display-recipe");
	};

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.setValue("instructions", editorContent as string);
					form.handleSubmit(onSubmit, onInvalid)(e); // <-- add second param: onInvalid
				}}
				className="space-y-6"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									{...field}
									className="placeholder:text-muted-foreground"
									placeholder="Recipe title"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									rows={2}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<FormField
						control={form.control}
						name="portions"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Portions</FormLabel>
								<FormControl>
									<Input
										type="number"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="preparation"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Preparation</FormLabel>
								<FormControl>
									<Input
										type="text"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="cookingTime"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Cooking Time</FormLabel>
								<FormControl>
									<Input
										type="number"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					{(
						["calories", "fat", "carbohydrates", "protein"] as const
					).map((fieldKey) => (
						<FormField
							key={fieldKey}
							control={form.control}
							name={fieldKey}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="capitalize">
										{fieldKey}
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											value={field.value ?? 0}
											onChange={(e) =>
												field.onChange(
													Number(e.target.value),
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
				</div>

				<div>
					<FormLabel>Ingredients</FormLabel>
					<div className="space-y-2">
						{ingredients.map((item, index) => (
							<div
								key={item.id}
								className="grid grid-cols-[1fr_1fr_2fr_auto] items-center gap-2"
							>
								<Input
									type="number"
									placeholder="Amount"
									className="placeholder:text-muted-foreground"
									{...form.register(
										`ingredients.${index}.amount`,
									)}
								/>
								<Input
									placeholder="Unit"
									className="placeholder:text-muted-foreground"
									{...form.register(
										`ingredients.${index}.unit`,
									)}
								/>
								<Input
									placeholder="Ingredient name"
									className="placeholder:text-muted-foreground"
									{...form.register(
										`ingredients.${index}.name`,
									)}
								/>
								<button
									type="button"
									onClick={() => remove(index)}
									className="text-red-500 hover:text-red-700"
								>
									<X className="h-4 w-4" />
								</button>
							</div>
						))}
						<Button
							type="button"
							variant="ghost"
							onClick={() =>
								append({
									amount: 0,
									unit: "",
									name: "",
								})
							}
						>
							+ Add Ingredient
						</Button>
					</div>
				</div>

				<FormItem>
					<FormLabel>Image</FormLabel>
					<FormControl>
						<Input
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
						/>
					</FormControl>
					{imagePreview && (
						<div className="relative mt-2 h-48 w-full rounded-lg overflow-hidden">
							<Image
								src={imagePreview}
								alt="Recipe preview"
								fill
								className="object-cover"
							/>
						</div>
					)}
				</FormItem>

				<FormItem>
					<FormLabel>Instructions</FormLabel>
					<TooltipProvider>
						<MinimalTiptapEditor
							value={editorContent}
							onChange={setEditorContent}
							className="w-full"
							editorContentClassName="p-5"
							output="html"
							placeholder="Enter instructions..."
							editable
						/>
					</TooltipProvider>
				</FormItem>

				<div className="flex w-full items-center justify-between">
					<div className="flex items-center gap-2">
						<Globe className="text-muted-foreground h-4 w-4" />
						<FormLabel
							htmlFor="public-toggle"
							className="text-sm"
						>
							Public
						</FormLabel>
						<Switch
							id="public-toggle"
							checked={form.watch("isPublic")}
							onCheckedChange={(checked) =>
								form.setValue("isPublic", checked)
							}
						/>
					</div>
				</div>
				<div className="flex gap-2 md:flex-row flex-col md:items-end w-full justify-end">
					<Button
						variant="outline"
						onClick={(e) => {
							e.preventDefault();
							setOpenDrawer(false);
						}}
					>
						Cancel
					</Button>
					<Button type="submit">Save</Button>
				</div>
			</form>
		</Form>
	);
}
