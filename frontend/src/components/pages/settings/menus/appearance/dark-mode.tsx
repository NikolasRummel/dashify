import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { MdOutlineAutoAwesome } from "react-icons/md";

export default function DarkModeSettings() {
	const { setTheme, theme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="w-44 justify-start"
					variant="outline"
				>
					{theme === "light" ? (
						<Sun
							className={`${theme === "light" ? "scale-100 rotate-0" : "scale-0 rotate-90"} size-full shrink-0 transition-transform`}
						/>
					) : theme === "dark" ? (
						<Moon
							className={`${theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"} size-10 transition-transform`}
						/>
					) : (
						<MdOutlineAutoAwesome
							className={`h-[1.2rem] w-[1.2rem] ${theme === "system" ? "scale-100 rotate-0" : "scale-0 rotate-90"} transition-transform`}
						/>
					)}
					{theme === "light"
						? "Light"
						: theme === "dark"
							? "Dark"
							: "Follow System"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					Follow System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
