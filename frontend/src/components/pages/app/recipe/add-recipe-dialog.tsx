"use client";

import { MinimalTiptapEditor } from "@/components/pages/app/recipe/minimal-tiptap";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { createRecipe } from "@/lib/api/recipe";
import {
	CreateRecipeDto,
	RecipeFormValues,
	recipeSchema,
} from "@/types/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Content } from "@tiptap/react";
import { Globe, Plus, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export function AddRecipeDialog() {
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [editorContent, setEditorContent] = useState<Content>("");

	const form = useForm<RecipeFormValues>({
		resolver: zodResolver(recipeSchema),
		defaultValues: {
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
		const payload: CreateRecipeDto = {
			...values,
			instructions: editorContent as string,
			ingredients: values.ingredients.map((ingredient) => ({
				...ingredient,
				amount: Number(ingredient.amount),
			})),
		};

		try {
			await createRecipe(payload);
			toast.success("Recipe created successfully!");
		} catch (err) {
			toast.error("Failed to create recipe.");
			console.error(err);
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="rounded-full bg-white p-3 dark:bg-[#1a1a1a]">
					<Plus className="h-5 w-5 text-black dark:text-white" />
				</button>
			</DialogTrigger>
			<DialogContent className="max-h-[90%] overflow-y-auto dark:bg-[#1a1a1a]">
				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.setValue(
								"instructions",
								editorContent as string,
							); // 💡 inject editor content
							form.handleSubmit(onSubmit)(e); // 🧠 trigger submission
						}}
						className="space-y-6 text-white"
					>
						<DialogHeader>
							<DialogTitle>Add Recipe</DialogTitle>
							<DialogDescription className="text-white/60">
								Fill in the details of your recipe.
							</DialogDescription>
						</DialogHeader>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
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
								[
									"calories",
									"fat",
									"carbohydrates",
									"protein",
								] as const
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
															Number(
																e.target.value,
															),
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
											{...form.register(
												`ingredients.${index}.amount`,
											)}
										/>
										<Input
											placeholder="Unit"
											{...form.register(
												`ingredients.${index}.unit`,
											)}
										/>
										<Input
											placeholder="Ingredient name"
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
								<img
									src={imagePreview}
									alt="Preview"
									className="mt-2 max-h-48 w-full rounded-lg object-cover"
								/>
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
									autofocus
									editable
								/>
							</TooltipProvider>
						</FormItem>

						<DialogFooter>
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
								<Button type="submit">Create Recipe</Button>
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
