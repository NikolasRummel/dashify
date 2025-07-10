import { dashboardIsWidgetDrawerOpenState } from "@/atoms/dashboard";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import CategoryList from "./CategoryList";
import WidgetList from "./WidgetList";
import { useAtom } from "jotai";

export default function WidgetDrawer() {
	const [isOpen, setIsOpen] = useAtom(dashboardIsWidgetDrawerOpenState);

	return (
		<Drawer
			open={isOpen}
			onOpenChange={setIsOpen}
			shouldScaleBackground={false}
		>
			<DrawerContent
				className="mr-auto ml-auto flex h-[640px] w-fit max-w-[1300px] flex-row"
				showOverlay={false}
			>
				<DrawerTitle className="sr-only">Widgets</DrawerTitle>
				<CategoryList />
				<WidgetList />
			</DrawerContent>
		</Drawer>
	);
}
