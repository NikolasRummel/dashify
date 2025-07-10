import {
	dashboardIsEditingState,
	dashboardIsUserAvatarModalOpenState,
	dashboardSettingsOpenState,
} from "@/atoms/dashboard";
import { authHideForm } from "@/atoms/login";
import SettingsModal from "@/components/pages/settings/SettingsModal";
import { Button } from "@/components/ui/button";
import {
	Modal,
	ModalContent,
	ModalMain,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import StaggerContainerWrapper from "@/components/wrappers/motion/stagger/container-wrapper";
import StaggerItemWrapper from "@/components/wrappers/motion/stagger/item-wrapper";
import { useSession } from "@/hooks/use-session";
import { logoutUser } from "@/lib/api/auth";
import { easeOutQuart } from "@/lib/motion";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FaCheck, FaGear } from "react-icons/fa6";
import { HiOutlineLogout } from "react-icons/hi";
import UserAvatar from "../../../../ui/user-avatar";

export default function UserAvatarMenu({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { user } = useSession();
	const [open, setIsOpen] = useAtom(dashboardIsUserAvatarModalOpenState);
	const setSetingsDialogOpen = useSetAtom(dashboardSettingsOpenState);
	const setHideAuthForm = useSetAtom(authHideForm);
	const [isEditing, setIsEditing] = useAtom(dashboardIsEditingState);

	useEffect(() => {
		setHideAuthForm(false);
	}, [setHideAuthForm]);

	const animationVariants = {
		hidden: {
			opacity: 0,
			y: -32,
		},
		visible: {
			opacity: 1,
			y: 0,
		},
	};
	const animationDuration = 0.35;

	return (
		<Modal
			open={open}
			onOpenChange={setIsOpen}
			desktop="popover"
		>
			<ModalTrigger>
				<div>{children}</div>
			</ModalTrigger>
			<ModalContent className="mt-2 overflow-clip">
				<ModalMain className="items-center">
					<StaggerContainerWrapper
						className="flex w-full flex-col items-center gap-2"
						staggerDelay={0.025}
					>
						{/* Profile Picture */}
						<ModalTitle className="sr-only">
							User Profile
						</ModalTitle>
						<StaggerItemWrapper
							ease={easeOutQuart}
							duration={animationDuration}
							variants={animationVariants}
						>
							<UserAvatar
								className="mt-4 border-4"
								size={96}
							/>
						</StaggerItemWrapper>
						<StaggerItemWrapper
							ease={easeOutQuart}
							duration={animationDuration}
							variants={animationVariants}
						>
							<div className="flex flex-col items-center">
								<h1 className="text-lg font-bold">
									{user?.username || "Error"}
								</h1>
								<p className="text-primary">
									{user?.email || "Error"}
								</p>
							</div>
						</StaggerItemWrapper>
						{/* Separator */}
						<StaggerItemWrapper
							className="h-full w-full px-2"
							ease={easeOutQuart}
							duration={animationDuration}
							variants={animationVariants}
						>
							<Separator className="bg-primary/30 my-2 w-full" />
						</StaggerItemWrapper>
						{/* Start Editing */}
						<StaggerItemWrapper
							className="w-full"
							ease={easeOutQuart}
							duration={animationDuration}
							variants={animationVariants}
						>
							<Button
								className="w-full rounded-full"
								variant="secondary"
								onClick={() => {
									setIsEditing(!isEditing);
								}}
							>
								{/* <FaGear className="mr-0.5" />
								 */}
								{!isEditing ? (
									<>
										<AiFillEdit className="mr-0.5" />
										Edit Dashboard
									</>
								) : (
									<>
										<FaCheck className="mr-0.5" />
										Finish Editing and Save
									</>
								)}
							</Button>
						</StaggerItemWrapper>
						{/* Settings */}
						<StaggerItemWrapper
							className="w-full"
							ease={easeOutQuart}
							duration={animationDuration}
							variants={animationVariants}
						>
							<SettingsModal>
								<Button
									className="w-full rounded-full"
									variant="secondary"
									onClick={() => setSetingsDialogOpen(true)}
								>
									<FaGear className="mr-0.5" />
									Settings
								</Button>
							</SettingsModal>
						</StaggerItemWrapper>
						{/* Log out */}
						<StaggerItemWrapper
							className="w-full"
							ease={easeOutQuart}
							duration={animationDuration}
							variants={animationVariants}
						>
							<Button
								className="w-full rounded-full"
								onClick={() => {
									setIsOpen(false);
									logoutUser().then(() => {
										router.refresh();
										router.push("/");
									});
								}}
							>
								<HiOutlineLogout className="mr-0.5" />
								Log out
							</Button>
						</StaggerItemWrapper>
					</StaggerContainerWrapper>
				</ModalMain>
			</ModalContent>
		</Modal>
	);
}
