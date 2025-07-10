import { Input } from "@/components/ui/input";
import { TbLoader } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { authenticationFormSelectedTabAtom, authHideForm } from "@/atoms/login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginSchema } from "@/types/auth";
import { loginUser } from "@/lib/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useSetAtom } from "jotai";
import { useState } from "react";

export default function LoginForm() {
	const router = useRouter();
	const setActiveMenu = useSetAtom(authenticationFormSelectedTabAtom);
	const setAuthContainerHidden = useSetAtom(authHideForm);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof LoginSchema>) {
		setIsLoading(true);
		loginUser(values)
			.then(() => {
				toast.success("Logged in successfully!");
				setAuthContainerHidden(true);
				setTimeout(() => {
					router.refresh();
					router.push("/dashboard");
				}, 300);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-6">
			<div className="flex flex-col items-center gap-2">
				<div className="text-center text-6xl font-bold text-white/90 select-none">
					Welcome back
				</div>
				<div className="text-md text-center font-normal text-white/80 select-none">
					Enter your credentials to log in to Dashify.
				</div>
			</div>
			<div className="flex w-96 flex-col gap-4">
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
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
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
					</form>
				</Form>
				<div className="flex flex-row items-center justify-between">
					<Link
						href="#"
						className="text-sm font-normal text-white hover:underline"
						onClick={(e) => {
							e.preventDefault();
							setActiveMenu("forgot-password");
						}}
					>
						Forgot password?
					</Link>
					<Link
						href="#"
						className="text-sm font-normal text-white hover:underline"
						onClick={(e) => {
							e.preventDefault();
							setActiveMenu("register");
						}}
					>
						Don&apos;t have an account yet? <b>Sign up</b>
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
					isLoading ? "w-12 px-5" : "w-28"
				}`}
			>
				<div
					className={`absolute transition-opacity duration-500 ${
						isLoading ? "opacity-0" : "opacity-100"
					}`}
				>
					Log in
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
