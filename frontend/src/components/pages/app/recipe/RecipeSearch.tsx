"use client";

import { recipesNavigationAtom, searchResultsAtom } from "@/atoms/recipes";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { searchRecipes, suggestRecipes } from "@/lib/api/recipe";
import { easeOutQuart } from "@/lib/motion";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { useSetAtom } from "jotai";
import { motion } from "motion/react";
import { debounce } from "next/dist/server/utils";
import { FormEvent, Fragment, useCallback, useEffect, useState } from "react";

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
			ease: easeOutQuart,
		},
	},
};

export default function RecipeSearch() {
	const [query, setQuery] = useState<string>("");
	const [suggestions, setSuggestions] = useState<
		{ id: number; title: string }[]
	>([]);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const setActiveTab = useSetAtom(recipesNavigationAtom);
	const setSearchResults = useSetAtom(searchResultsAtom);

	const fetchSuggestions = async (q: string) => {
		if (!q) return setSuggestions([]);
		try {
			const res = await suggestRecipes(q, true);
			setSuggestions(res);
		} catch (e) {
			console.error("Suggestion fetch failed", e);
		}
	};

	const debouncedFetch = useCallback(debounce(fetchSuggestions, 300), []);

	useEffect(() => {
		debouncedFetch(query);
	}, [query, debouncedFetch]);

	const handleSelect = async (recipe: { id: number; title: string }) => {
		setQuery(recipe.title);
		handleSearch();
	};

	const handleSearch = async (e?: FormEvent<HTMLFormElement>) => {
		e?.preventDefault();
		setActiveTab("search");
		try {
			searchRecipes(query, true /* privateOnly */).then((res) => {
				console.log("Search results", res);
				setSearchResults(res);
			});
		} catch (e) {
			console.error("Search failed", e);
		}
	};

	return (
		<form
			onSubmit={handleSearch}
			className="z-100 h-full"
		>
			<Popover open={suggestions.length > 0 && isFocused}>
				<PopoverAnchor className="h-full">
					<input
						type="text"
						placeholder="Search recipes..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setIsFocused(true)}
						onBlur={() =>
							setTimeout(() => setIsFocused(false), 200)
						}
						className="w-full h-full bg-popover/70 backdrop-blur-xl text-popover-foreground rounded-full px-4 py-2 outline-none border border-border/70 z-10"
					/>
				</PopoverAnchor>
				<PopoverContent
					side="bottom"
					align="center"
					onOpenAutoFocus={(e) => e.preventDefault()}
					className="w-96 p-1.5"
				>
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="show"
						className="flex flex-col gap-1.5"
					>
						{suggestions.map((suggestion, index) => (
							<Fragment key={suggestion.id}>
								<motion.div
									variants={itemVariants}
									onClick={() => handleSelect(suggestion)}
									className="line-clamp-1 hover:bg-popover-foreground/10 text-popover-foreground rounded-full px-4 py-2 cursor-pointer"
									style={{
										borderTopLeftRadius:
											index === 0 ? 24 : 10,
										borderTopRightRadius:
											index === 0 ? 24 : 10,
										borderBottomLeftRadius:
											index === suggestions.length - 1
												? 24
												: 10,
										borderBottomRightRadius:
											index === suggestions.length - 1
												? 24
												: 10,
									}}
								>
									{suggestion.title}
								</motion.div>
								{index < suggestions.length - 1 && (
									<Separator className="w-full mx-2" />
								)}
							</Fragment>
						))}
					</motion.div>
				</PopoverContent>
			</Popover>
		</form>
	);
}
