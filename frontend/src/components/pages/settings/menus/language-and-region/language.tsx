import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/hooks/use-session";

export default function LanguageSettings() {
	const { user, update } = useSession();

	const languages = [
		{
			label: "English",
			value: "ENGLISH",
			icon: "🇺🇸",
		},
		{
			label: "German",
			value: "GERMAN",
			icon: "🇩🇪",
		},
	];

	return (
		<Select
			defaultValue={user?.language}
			onValueChange={(value) => {
				update({ language: value });
			}}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a language" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{languages.map((language) => (
						<SelectItem key={language.value} value={language.value}>
							{language.icon} {language.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
