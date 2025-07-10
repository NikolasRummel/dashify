"use client";

import {
	aiDialogOpenState,
	recipeFormDialogOpenState,
	selectedRecipeAtom,
} from "@/atoms/recipes";
import AIBubble from "@/components/ui/ai-bubble";
import AiButton from "@/components/ui/ai-button";
import AiInput from "@/components/ui/ai-input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { generateRecipe } from "@/lib/api/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiSolidSend } from "react-icons/bi";
import { PiSpinner } from "react-icons/pi";
import { z } from "zod";

const aiPromptSchema = z.object({
	query: z.string().min(1),
});

export default function AiPrompt() {
	const [isLoading, setIsLoading] = useState(false);
	const setSelectedRecipe = useSetAtom(selectedRecipeAtom);
	const setEditFormOpen = useSetAtom(recipeFormDialogOpenState);
	const setOpenAiDialog = useSetAtom(aiDialogOpenState);

	const form = useForm({
		resolver: zodResolver(aiPromptSchema),
		defaultValues: {
			query: "",
		},
	});

	function onSubmit(values: z.infer<typeof aiPromptSchema>) {
		setIsLoading(true);

		generateRecipe(values.query).then((recipe) => {
			console.log(recipe);
			setSelectedRecipe(recipe);
			setEditFormOpen(true);
			setOpenAiDialog(false);
			setIsLoading(false);
		});
	}

	return (
		<div className="w-96 h-[512px] flex flex-col justify-center items-center text-primary gap-4">
			<AIBubble />
			<div className="text-center">
				<h1 className="text-2xl font-bold">
					Can&apos;t find what you&apos;re looking for?
				</h1>
				<p className="text-muted-foreground">
					Generate a recipe using <b>Dashify Inteligence</b>.
				</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<motion.div
						className="flex gap-4 items-center mt-4"
						layout
					>
						<AnimatePresence mode="wait">
							{!isLoading ? (
								<motion.div
									key="input-form"
									initial={{ opacity: 1 }}
									exit={{
										opacity: 0,
										scale: 0.8,
										transition: { duration: 0.3 },
									}}
									className="flex gap-4 items-center"
									layout
								>
									<FormField
										control={form.control}
										name="query"
										render={({ field }) => (
											<FormItem className="flex-1">
												<FormControl className="flex-1">
													<motion.div layout>
														<AiInput
															variant="large"
															className="rounded-full w-80"
															alignIcon="end"
															placeholder="What do you want to cook?"
															{...field}
														/>
													</motion.div>
												</FormControl>
											</FormItem>
										)}
									/>
									<motion.div layout>
										<AiButton
											className="rounded-full h-full w-auto aspect-square"
											type="submit"
										>
											<BiSolidSend />
										</AiButton>
									</motion.div>
								</motion.div>
							) : (
								<motion.div
									key="loading-spinner"
									initial={{
										opacity: 0,
										scale: 0.8,
									}}
									animate={{
										opacity: 1,
										scale: 1,
										transition: { duration: 0.3 },
									}}
									className="flex justify-center items-center"
									layout
								>
									<motion.div
										className="relative"
										initial={{ scale: 0.8 }}
										animate={{ scale: 1 }}
										transition={{ duration: 0.3 }}
									>
										<AiButton
											className="rounded-full hover:bg-current h-12 disabled:opacity-100"
											disabled
										>
											Generating...
											<PiSpinner className="text-white text-2xl animate-spin" />
										</AiButton>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</form>
			</Form>
		</div>
	);
}
