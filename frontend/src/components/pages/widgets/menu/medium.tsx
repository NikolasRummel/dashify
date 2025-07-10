"use client";

import { getMenuForToday, MenuDaysReponse } from "@/lib/api/menu";
import { useEffect, useState } from "react";

export default function Menu() {
	const [mealOptions, setMealOptions] = useState<
		MenuDaysReponse["categories"][]
	>([]);

	useEffect(() => {
		getMenuForToday().then((menu) => {
			setMealOptions(menu);
		});
	}, []);

	return (
		<div className="size-full flex gap-2 p-3.5">
			{mealOptions &&
				mealOptions.map((category) => (
					<div
						key={category.name}
						className="flex flex-col gap-1 w-full"
					>
						<h2 className="text-[11px] text-widget-accent line-clamp-1">
							{category.name}
						</h2>
						<div className="text-[9px] font-medium flex flex-col gap-1">
							{category.meals.slice(0, 2).map((meal) => (
								<span
									key={meal.name}
									className="line-clamp-3"
								>
									{meal.name}
								</span>
							))}
						</div>
					</div>
				))}
		</div>
	);
}
