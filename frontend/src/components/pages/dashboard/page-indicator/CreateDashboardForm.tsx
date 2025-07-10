import {
	FormField,
	FormItem,
	FormControl,
	FormMessage,
	Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createDashboard } from "@/lib/api/dashboard";
import { easeOutQuart } from "@/lib/motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAtom, useSetAtom } from "jotai";
import {
	dashboardCurrentPageState,
	dashboardPageIndicatorState,
	dashboardsState,
} from "@/atoms/dashboard";
import { useEffect } from "react";

const DashboardCreateSchema = z.object({
	name: z.string().min(1, "Dashboard name is required"),
});

export default function CreateDashboardForm() {
	const [dashboards, setDashboards] = useAtom(dashboardsState);
	const setCurrentPage = useSetAtom(dashboardCurrentPageState);
	const [indicatorState, setIndicatorState] = useAtom(
		dashboardPageIndicatorState,
	);

	const form = useForm<z.infer<typeof DashboardCreateSchema>>({
		resolver: zodResolver(DashboardCreateSchema),
		defaultValues: {
			name: "",
		},
	});

	function handleCreate(values: z.infer<typeof DashboardCreateSchema>) {
		createDashboard(values.name).then((res) => {
			if (res.status === 200) {
				setDashboards((prev) => [...prev, res.data]);
				setIndicatorState(null);
				toast.success("Dashboard created successfully");
				form.reset();
				setTimeout(() => {
					setCurrentPage(dashboards.length);
				}, 100);
			}
		});
	}

	// Focus the input when the form is shown
	useEffect(() => {
		if (indicatorState === "create") {
			const input = document.querySelector(
				"input[name='name']",
			) as HTMLInputElement;
			if (input) {
				input.focus();
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
				<form onSubmit={form.handleSubmit(handleCreate)}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder="Add new dashboard"
										className="h-9 rounded-full text-white"
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
