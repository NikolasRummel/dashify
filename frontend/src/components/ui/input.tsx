import { cn } from "@/lib/utils";
import * as React from "react";
import { LuEye, LuEyeOff } from "react-icons/lu"; // Import the icons

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	variant?: "small" | "large" | "ai";
	icon?: React.ReactNode;
	alignIcon?: "start" | "end";
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, variant, icon, alignIcon, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);

		const togglePasswordVisibility = () => {
			setShowPassword((prev) => !prev);
		};

		return (
			<div className="relative w-full">
				<input
					type={type === "password" && showPassword ? "text" : type}
					className={cn(
						"file:text-foreground flex h-9 w-full rounded-md border bg-white/10 px-3 py-2 text-sm outline-hidden transition-all duration-500 file:text-sm file:font-semibold focus:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50",
						className,
						{
							"placeholder:text-black/50 dark:placeholder:text-white/50":
								variant === "ai",
							"text-sm": variant === "small",
							"text-md h-12 rounded-full border-white/10 px-5 py-2 font-normal focus:border-white/50":
								variant === "large",
							"font-mono placeholder:font-sans":
								type === "password",
						},
					)}
					ref={ref}
					{...props}
				/>
				{icon && (
					<span
						className={cn(
							"absolute top-1/2 flex -translate-y-1/2 transform items-center justify-center",
							{
								"left-3": alignIcon === "start",
								"right-3": alignIcon === "end",
							},
						)}
					>
						{icon}
					</span>
				)}
				{type === "password" && (
					<button
						type="button"
						className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 transform flex-row items-center justify-center"
						onClick={togglePasswordVisibility}
					>
						{showPassword ? <LuEyeOff /> : <LuEye />}
					</button>
				)}
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input };
