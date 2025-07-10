import { Input } from "@/components/ui/input";
import { TbLoader } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { authenticationFormSelectedTabAtom } from "@/atoms/login";
import { z } from "zod";
import { RegisterSchema } from "@/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { registerUser } from "@/lib/api/auth";
import { toast } from "sonner";
import { useSetAtom } from "jotai";

export default function RegisterForm() {
	const setActiveMenu = useSetAtom(authenticationFormSelectedTabAtom);
	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(values: z.infer<typeof RegisterSchema>) {
		registerUser({
			password: values.password,
			username: values.username,
			email: values.email,
		})
			.then(() => {
				setActiveMenu("login");
				toast.success("Account created successfully!");
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const isLoading = form.formState.isSubmitting;

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-6">
			<div className="flex flex-col items-center gap-2">
				<div className="text-center text-6xl font-bold text-white/90 select-none">
					Create account
				</div>
				<div className="text-md text-center font-normal text-balance text-white/80 select-none">
					Pick a username and password to get started.
				</div>
			</div>
			<div className="flex w-96 flex-col items-center gap-4">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 text-white"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								form.handleSubmit(onSubmit)();
							}
						}}
					>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											variant="large"
											placeholder="Username"
											type="text"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											variant="large"
											placeholder="E-Mail"
											type="email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Separator className="w-11/12" />
						<div className="flex w-full flex-row gap-4">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												variant="large"
												placeholder="Password"
												type="password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												variant="large"
												placeholder="Confirm password"
												type="password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</form>
				</Form>
				<div className="flex w-full flex-row items-center justify-end">
					<Link
						href="#"
						className="text-sm font-normal text-white hover:underline"
						onClick={(e) => {
							e.preventDefault();
							setActiveMenu("login");
						}}
					>
						Already have an account? <b>Sign in</b>
					</Link>
				</div>
			</div>
			<Button
				type="submit"
				onClick={() => {
					form.handleSubmit(onSubmit)();
				}}
				size="lg"
				disabled={isLoading}
				className={`group relative flex flex-row items-center justify-center gap-2 rounded-full transition-all duration-500 ${
					isLoading ? "w-12 px-5" : "w-32"
				}`}
			>
				<div
					className={`absolute transition-opacity duration-500 ${
						isLoading ? "opacity-0" : "opacity-100"
					}`}
				>
					Register
				</div>
				<TbLoader
					className={`absolute animate-spin transition-opacity ${
						isLoading ? "opacity-100" : "opacity-0"
					}`}
					style={{
						transitionDuration: "0.5s",
					}}
					size={16}
				/>
			</Button>
		</div>
	);
}
