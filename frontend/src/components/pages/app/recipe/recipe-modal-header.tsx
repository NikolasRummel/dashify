interface RecipeModalHeaderProps {
	activeTab: string;
}

function RecipeModalHeader({ activeTab }: RecipeModalHeaderProps) {
	let title = "My recipes";
	let description = "These are the recipes you've added to your cookbook.";

	if (activeTab === "Shared with me") {
		title = "Shared recipes";
		description = "These are recipes others have shared with you.";
	} else if (activeTab === "Explore") {
		title = "Explore";
		description = "Discover public recipes shared by the community.";
	}

	return (
		<div className="p-6 flex-shrink-0">
			<h2 className="text-2xl font-bold">{title}</h2>
			<p className="mt-1 text-sm text-gray-400">{description}</p>
		</div>
	);
}

export default RecipeModalHeader;
