export default function SharedWithMe() {
	return (
		<div className="flex flex-col items-center pt-32 h-[70vh]">
			<div className="flex flex-col items-center justify-center gap-4">
				<span className="text-6xl">🔨 + 🌐</span>
				<div className="text-center">
					<span className="text-xl font-semibold">
						Work in progress
					</span>
					<p className="text-sm text-muted-foreground">
						Recipes shared with you by others will appear here.
					</p>
				</div>
			</div>
		</div>
	);
}
