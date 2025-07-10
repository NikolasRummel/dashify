import {
	FormField,
	FormItem,
	FormControl,
	FormMessage,
	Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateDashboard } from "@/lib/api/dashboard";
import { easeOutQuart } from "@/lib/motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAtom, useSetAtom } from "jotai";
import {
	dashboardPageIndicatorState,
	dashboardsState,
} from "@/atoms/dashboard";
import { Dashboard } from "@/types/dashboard";
import { useEffect } from "react";

const DashboardCreateSchema = z.object({
	name: z.string().min(1, "Dashboard name is required"),
});

export default function EditDashboardForm({
	dashboard,
}: {
	dashboard: Dashboard;
}) {
	const setDashboards = useSetAtom(dashboardsState);
	const [indicatorState, setIndicatorState] = useAtom(
		dashboardPageIndicatorState,
	);

	const form = useForm<z.infer<typeof DashboardCreateSchema>>({
		resolver: zodResolver(DashboardCreateSchema),
		defaultValues: {
			name: dashboard.name,
		},
	});

	function handleUpdate(values: z.infer<typeof DashboardCreateSchema>) {
		updateDashboard(dashboard.id, {
			name: values.name,
		}).then((res) => {
			const updatedDashboard = res.data;
			setDashboards((prev) =>
				prev.map((d) =>
					d.id === updatedDashboard.id ? updatedDashboard : d,
				),
			);
			setIndicatorState(null);
			toast.success("Dashboard updated");
		});
	}

	// Focus the input when the form is shown
	useEffect(() => {
		if (indicatorState === "edit") {
			const input = document.querySelector(
				"input[name='name']",
			) as HTMLInputElement;
			if (input) {
				input.focus();
				input.select();
			}
		}
	}, [indicatorState]);

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
			className="-mr-2"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleUpdate)}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder={dashboard.name}
										className="h-9 rounded-full"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</motion.div>
	);
}
