"use client";
import { dashboardBackgroundState } from "@/atoms/dashboard";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import ItemEntryWrapper from "@/components/wrappers/motion/entry-wrapper";
import { useSession } from "@/hooks/use-session";
import { backgrounds } from "@/lib/backgrounds";
import { easeOutQuart } from "@/lib/motion";
import { useSetAtom } from "jotai";
import React from "react";

export default function BackgroundPicker({
	children,
}: {
	children: React.ReactNode;
}) {
	const { update } = useSession();
	const setBackground = useSetAtom(dashboardBackgroundState);

	function handleSetBackground(background: string) {
		console.log("setBackground", background);
		setBackground(background);
		update({
			backgroundImage: background,
		});
	}

	return (
		<Modal
			desktop="dialog"
			mobile="drawer"
		>
			<ModalTrigger className="w-fit">{children}</ModalTrigger>
			<ModalContent className="rounded-2xl md:w-fit">
				<ModalHeader>
					<ModalTitle>Wallpapers</ModalTitle>
					<ModalDescription>
						Choose your favorite background from the options below.
					</ModalDescription>
				</ModalHeader>
				<div
					onWheel={(e) => console.log(e)}
					className="grid grid-cols-5 p-4 md:p-0 gap-1"
				>
					{backgrounds.map((background, index) => (
						<ItemEntryWrapper
							key={index}
							variants={{
								hidden: {
									scale: 0.7,
									opacity: 0,
									filter: "blur(8px) brightness(4)",
									x: -32,
								},
								visible: {
									scale: 1,
									opacity: 1,
									filter: "blur(0px) brightness(1)",
									x: 0,
								},
							}}
							ease={easeOutQuart}
							duration={1}
							delay={index * 0.035}
							className="flex flex-col justify-center p-1"
						>
							<button
								className="aspect-video md:h-10 cursor-pointer rounded-sm bg-cover bg-center ring-2 ring-white/60 transition-all duration-200 hover:scale-105 hover:border-white/20"
								style={{
									backgroundImage: `url(${background})`,
								}}
								onClick={() => handleSetBackground(background)}
							/>
						</ItemEntryWrapper>
					))}
				</div>
			</ModalContent>
		</Modal>
	);
}
