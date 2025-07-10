import { dashboardPageIndicatorState } from "@/atoms/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { shareDashboard } from "@/lib/api/dashboard";
import { suggestUsersForSharing, UserSharingSummary } from "@/lib/api/user";
import { easeOutQuart } from "@/lib/motion";
import { Dashboard } from "@/types/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { useAtomValue } from "jotai";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const UserSearchSchema = z.object({
	query: z.string().min(1, "Query is requierd"),
});

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
			ease: easeOutQuart,
		},
	},
};

export default function ShareDashboardForm({
	dashboard,
}: {
	dashboard: Dashboard;
}) {
	const [results, setResults] = useState<UserSharingSummary[]>([]);
	const indicatorState = useAtomValue(dashboardPageIndicatorState);

	const form = useForm<z.infer<typeof UserSearchSchema>>({
		resolver: zodResolver(UserSearchSchema),
		defaultValues: {
			query: "",
		},
	});

	function handleSearch(values: z.infer<typeof UserSearchSchema>) {
		suggestUsersForSharing(values.query, dashboard.id).then((res) => {
			setResults(res);
		});
	}

	// Focus the input when the form is shown
	useEffect(() => {
		if (indicatorState === "share") {
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
			<Popover
				open={results.length > 0 && form.getValues("query").length > 0}
			>
				<PopoverAnchor>
					<Form {...form}>
						<form onChange={form.handleSubmit(handleSearch)}>
							<FormField
								control={form.control}
								name="query"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder="Search user"
												className="h-9 rounded-full"
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</PopoverAnchor>
				<PopoverContent
					side="top"
					align="end"
					className="mb-3 bg-transparent border-none shadow-none backdrop-blur-none flex flex-col gap-2 p-0 -mr-2"
					onOpenAutoFocus={(e) => e.preventDefault()}
				>
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="show"
						className="flex flex-col gap-2"
					>
						{results.map((elem) => (
							<motion.div
								key={elem.id}
								variants={itemVariants}
								className="flex border items-center gap-4 bg-popover/70 border-border/70 text-popover-foreground rounded-full backdrop-blur-xl px-3 py-2"
							>
								<Avatar>
									<AvatarImage
										src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/image/${elem.id}/image`}
									/>
									<AvatarFallback>
										{elem.username.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-bold">{elem.username}</p>
									<p className="text-popover-foreground/70">
										{elem.email}
									</p>
								</div>
								<Checkbox
									className="ml-auto mr-2 rounded-full"
									defaultChecked={elem.sharing}
									onCheckedChange={() => {
										shareDashboard(dashboard.id, elem.id)
											.then(() => {
												toast.success(
													"Dashboard sharing updated successfully",
												);
											})
											.catch(() => {
												toast.error(
													"Failed to update dashboard sharing",
												);
											});
									}}
								/>
							</motion.div>
						))}
					</motion.div>
				</PopoverContent>
			</Popover>
		</motion.div>
	);
}
