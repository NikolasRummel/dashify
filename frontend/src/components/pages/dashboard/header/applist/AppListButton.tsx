import { dashboardAppListIsOpenState } from "@/atoms/dashboard";
import { Button } from "@/components/ui/button";
import { Modal, ModalTrigger } from "@/components/ui/modal";
import { useAtom } from "jotai";
import { IoApps } from "react-icons/io5";
import AppListMenu from "./AppListMenu";

export default function AppListButton() {
	const [dashboardAppListIsOpen, setDashboardAppListIsOpen] = useAtom(
		dashboardAppListIsOpenState,
	);

	return (
		<Modal
			desktop="popover"
			mobile="drawer"
			open={dashboardAppListIsOpen}
			onOpenChange={setDashboardAppListIsOpen}
		>
			<ModalTrigger>
				<Button
					variant="ghost"
					className="flex h-12 w-12 items-center justify-center rounded-full text-white/90 transition-colors duration-500 hover:text-white"
					data-cy="app-list-menu"
				>
					<IoApps
						style={{
							width: "1.5rem",
							height: "1.5rem",
						}}
						size={28}
					/>
				</Button>
			</ModalTrigger>
			<AppListMenu />
		</Modal>
	);
}
