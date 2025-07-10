"use client";

import { getRecipe, searchRecipes, suggestRecipes } from "@/lib/api/recipe";
import { Recipe } from "@/types/recipe";
import { debounce } from "next/dist/server/utils";
import { FormEvent, useCallback, useEffect, useState } from "react";

interface Props {
	onSearchResults: (results: Recipe[]) => void;
	privateOnly: boolean;
}

export default function SearchBarWithSuggestions({
	onSearchResults,
	privateOnly,
}: Props) {
	const [query, setQuery] = useState<string>("");
	const [suggestions, setSuggestions] = useState<
		{ id: number; title: string }[]
	>([]);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const fetchSuggestions = async (q: string) => {
		if (!q) return setSuggestions([]);
		try {
			const res = await suggestRecipes(q, privateOnly);
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
		setIsFocused(false);
		setSuggestions([]);

		try {
			const fullRecipe = await getRecipe(recipe.id);
			onSearchResults([fullRecipe]);
		} catch (e) {
			console.error("Failed to fetch selected recipe", e);
		}
	};

	const handleSearch = async (e?: FormEvent<HTMLFormElement>) => {
		e?.preventDefault();
		setLoading(true);
		try {
			const res = await searchRecipes(query, privateOnly);
			onSearchResults(res);
		} catch (e) {
			console.error("Search failed", e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSearch}
			className="z-100"
		>
			<div className="relative">
				<input
					type="text"
					placeholder="Search recipes..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setTimeout(() => setIsFocused(false), 200)}
					className="w-[600px] rounded-full bg-[#1a1a1a] px-5 py-3 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
				/>

				{isFocused && suggestions.length > 0 && (
					<ul className="ring-opacity-5 right-0 left-0 z-10 mt-2 max-h-60 overflow-y-auto rounded-xl bg-[#1a1a1a] text-white shadow-lg ring-1 ring-black">
						{suggestions.map((suggestion) => (
							<li
								key={suggestion.id}
								onClick={() => handleSelect(suggestion)}
								className="cursor-pointer px-4 py-2 hover:bg-[#2a2a2a]"
							>
								{suggestion.title}
							</li>
						))}
					</ul>
				)}
			</div>

			{loading && (
				<div className="mt-2 text-center text-sm text-gray-400">
					🔄 Searching recipes...
				</div>
			)}
		</form>
	);
}
