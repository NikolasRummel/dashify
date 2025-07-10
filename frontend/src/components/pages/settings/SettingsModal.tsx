import { dashboardSettingsOpenState } from "@/atoms/dashboard";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerNestedRoot,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import useIsMobile from "@/hooks/use-is-mobile";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useAtom } from "jotai";
import { useState } from "react";
import { settingsMenus } from "./menus";

export default function SettingsModal({
	children,
}: {
	children: React.ReactNode;
}) {
	const [open, setOpen] = useAtom(dashboardSettingsOpenState);
	const isMobile = useIsMobile();
	const [selectedMenu, setSeletedMenu] = useState(settingsMenus[0].id);

	return (
		<Modal
			open={open}
			onOpenChange={setOpen}
			mobile="nested_drawer"
		>
			<ModalTrigger>{children}</ModalTrigger>
			<ModalContent className="max-w-[1472px] md:w-[70%] overflow-x-hidden">
				<ModalHeader>
					<ModalTitle>Settings</ModalTitle>
					<ModalDescription>
						Manage your account settings here.
					</ModalDescription>
				</ModalHeader>
				{/* Mobile */}
				{isMobile && (
					<div className="mb-4 flex flex-col gap-2 px-4">
						{settingsMenus.map((menu) => (
							<DrawerNestedRoot key={menu.id}>
								<DrawerTrigger asChild>
									<Button
										variant="outline"
										className="justify-start border-black/10 bg-black/5 pl-6 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
									>
										{menu.icon} {menu.label}
									</Button>
								</DrawerTrigger>
								<DrawerContent className="flex w-full flex-col gap-2 p-4">
									<DrawerHeader>
										<DrawerTitle>{menu.title}</DrawerTitle>
										<DrawerDescription>
											{menu.description}
										</DrawerDescription>
									</DrawerHeader>
									<ScrollArea className="flex max-h-[486px] w-full flex-col gap-4">
										{menu.sections.map((section) => (
											<Card
												className="bg-primary-foreground mb-6 shadow-none"
												key={section.id}
											>
												<CardHeader>
													<CardTitle className="text-md font-semibold">
														{section.title}
													</CardTitle>
													<CardDescription className="text-muted-foreground text-xs font-normal">
														{section.description}
													</CardDescription>
												</CardHeader>
												<CardContent className="overflow-x-auto">
													{section.component}
												</CardContent>
											</Card>
										))}
									</ScrollArea>
									<DrawerClose asChild>
										<Button variant="ghost">
											Back to Settings
										</Button>
									</DrawerClose>
								</DrawerContent>
							</DrawerNestedRoot>
						))}
					</div>
				)}
				{/* Desktop */}
				{!isMobile && (
					<div className="flex flex-row gap-10">
						{/* Sidebar */}
						<div className="-ml-4 flex min-h-96 w-48 flex-col items-center">
							{settingsMenus.map((menu) => (
								<div
									key={menu.id}
									className="w-full"
								>
									<Button
										key={menu.id}
										variant="link"
										className={`h-fit w-full flex-row justify-start gap-3 py-3 text-start text-wrap ${selectedMenu === menu.id ? "text-primary font-bold underline" : "text-muted-foreground font-normal"}`}
										onClick={() => setSeletedMenu(menu.id)}
									>
										{menu.icon}
										{menu.label}
									</Button>
								</div>
							))}
						</div>
						{/* Main Content */}
						<ScrollArea className="flex h-[476px] w-full flex-col overflow-y-auto">
							{settingsMenus
								.filter((menu) => menu.id === selectedMenu)
								.map((menu) => (
									<div
										className="flex w-full flex-col gap-4"
										key={menu.id}
									>
										<div>
											<div className="text-primary text-2xl font-semibold">
												{menu.title}
											</div>
											<p className="text-muted-foreground text-sm font-normal">
												{menu.description}
											</p>
										</div>
										{menu.sections.map((section) => (
											<Card
												className="w-full shadow-none"
												key={section.id}
											>
												<CardHeader>
													<CardTitle className="text-lg">
														{section.title}
													</CardTitle>
													<CardDescription>
														{section.description}
													</CardDescription>
												</CardHeader>
												<CardContent className="overflow-x-auto py-1">
													{section.component}
												</CardContent>
											</Card>
										))}
									</div>
								))}
						</ScrollArea>
					</div>
				)}
			</ModalContent>
		</Modal>
	);
}
