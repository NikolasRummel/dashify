import { Input } from "@/components/ui/input";
import { TbLoader } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { authenticationFormSelectedTabAtom } from "@/atoms/login";
import { useSetAtom } from "jotai";

export default function ForgotPasswordForm() {
	const [isLoading, setIsLoading] = useState(false);
	const setActiveMenu = useSetAtom(authenticationFormSelectedTabAtom);

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-6">
			<div className="flex flex-col items-center gap-4">
				<div className="text-center text-6xl font-bold text-white/90 select-none">
					Reset password
				</div>
				<div className="text-md text-center font-normal text-balance text-white/80 select-none">
					Enter your E-Mail or Username and we&apos;ll send you a
					reset link.
				</div>
			</div>
			<div className="flex w-96 flex-col gap-4 text-white">
				<Input variant="large" placeholder="E-Mail / Username" />
				<div className="flex flex-row items-center justify-between">
					<Link
						href="#"
						className="text-sm font-normal hover:underline"
						onClick={(e) => {
							e.preventDefault();
							setActiveMenu("login");
						}}
					>
						Remember your password? <b>Sign in</b>
					</Link>
				</div>
			</div>
			<Button
				onClick={() => {
					setIsLoading(true);
					setTimeout(() => {
						setIsLoading(false);
						setActiveMenu("login");
					}, 2000);
				}}
				size="lg"
				disabled={isLoading}
				className={`group relative flex flex-row items-center justify-center gap-2 rounded-full transition-all duration-500 ${
					isLoading ? "w-12 px-5" : "w-36"
				}`}
			>
				<div
					className={`absolute transition-opacity duration-500 ${
						isLoading ? "opacity-0" : "opacity-100"
					}`}
				>
					Request reset
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
