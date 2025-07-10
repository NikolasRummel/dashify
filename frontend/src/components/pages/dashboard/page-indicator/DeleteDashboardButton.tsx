import {
	dashboardCurrentPageState,
	dashboardPageIndicatorState,
	dashboardsState,
} from "@/atoms/dashboard";
import { Button } from "@/components/ui/button";
import { deleteDashboard } from "@/lib/api/dashboard";
import { easeOutQuart } from "@/lib/motion";
import { Dashboard } from "@/types/dashboard";
import { useSetAtom } from "jotai";
import { motion } from "motion/react";
import { toast } from "sonner";

export default function DeleteDashboardButton({
	dashboard,
}: {
	dashboard: Dashboard;
}) {
	const setDashboards = useSetAtom(dashboardsState);
	const setShowInput = useSetAtom(dashboardPageIndicatorState);
	const setCurrentPage = useSetAtom(dashboardCurrentPageState);

	function handleDelete() {
		deleteDashboard(dashboard.id).then((res) => {
			if (res.status === 200) {
				setDashboards((prev) =>
					prev.filter((d) => d.id !== dashboard.id),
				);
				setShowInput(null);
				toast.success("Dashboard deleted successfully");
				setTimeout(() => {
					setCurrentPage((prev) => Math.max(prev - 1, 0));
				}, 100);
			}
		});
	}

	return (
		<motion.div
			layout
			initial={{ width: 0, opacity: 0 }}
			animate={{ width: "auto", opacity: 1 }}
			exit={{ width: 0, opacity: 0 }}
			transition={{
				duration: 0.5,
				ease: easeOutQuart,
			}}
			className="-mr-3"
		>
			<Button
				variant="destructive"
				className="max-w-96 justify-start gap-1 overflow-clip rounded-full"
				onClick={() => handleDelete()}
			>
				Delete<b>{dashboard.name}</b>
			</Button>
		</motion.div>
	);
}
