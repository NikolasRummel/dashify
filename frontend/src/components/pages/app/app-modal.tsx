import * as ScrollArea from "@radix-ui/react-scroll-area";
import React from "react";

export interface RecipeModalProps {
	children: React.ReactNode;
	headerComponent?: React.ReactNode;
}

const AppModal = ({ children, headerComponent }: RecipeModalProps) => {
	return (
		<div>
			<div className="absolute right-[5%] bottom-0 left-[5%] h-[80%] w-[90%] rounded-t-2xl bg-[#2b2b2f]/98 text-white shadow-2xl flex flex-col">
				{headerComponent}

				<div className="flex-1 overflow-hidden">
					<ScrollArea.Root className="h-full w-full">
						<ScrollArea.Viewport className="h-full w-full px-6 pb-6">
							{children}
						</ScrollArea.Viewport>
						<ScrollArea.Scrollbar
							className="hidden"
							orientation="vertical"
						>
							<ScrollArea.Thumb className="flex-1 bg-white/40 rounded-full relative" />
						</ScrollArea.Scrollbar>
					</ScrollArea.Root>
				</div>
			</div>
		</div>
	);
};

export default AppModal;
