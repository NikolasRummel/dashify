import { easeOutQuart, fadeInFromTopLg } from "@/lib/motion";
import ItemEntryWrapper from "@/components/wrappers/motion/entry-wrapper";
import Logo from "@/components/ui/logo";
import { useSession } from "@/hooks/use-session";

export default function Greeting() {
	const { user } = useSession();
	const date = new Date();

	const timeOfDay = {
		morning: date.getHours() < 12,
		afternoon: date.getHours() >= 12 && date.getHours() < 18,
		evening: date.getHours() >= 18,
	};
	const titleString = timeOfDay.morning
		? "Good morning"
		: timeOfDay.afternoon
			? "Good afternoon"
			: "Good evening";

	const subtitleString = timeOfDay.morning
		? "Rise and shine!"
		: timeOfDay.afternoon
			? "Hope you're having a productive day!"
			: "Have a great rest of your day!";

	return (
		<div className="font-rounded text-foreground 3xl:pt-20 absolute top-0 right-0 left-0 flex flex-col items-center justify-center pt-10 text-center select-none">
			<div className="flex flex-col items-center">
				<ItemEntryWrapper
					variants={fadeInFromTopLg}
					delay={0.25}
					duration={1}
					ease={easeOutQuart}
				>
					<Logo size={96} className="3xl:scale-110 scale-100" />
				</ItemEntryWrapper>
				<ItemEntryWrapper
					variants={fadeInFromTopLg}
					delay={0.35}
					duration={1}
					ease={easeOutQuart}
				>
					<h1 className="3xl:text-5xl text-4xl font-bold text-white">
						{titleString}, {user?.username || "Error"}!
					</h1>
				</ItemEntryWrapper>
			</div>
			<ItemEntryWrapper
				variants={fadeInFromTopLg}
				delay={0.5}
				duration={1}
				ease={easeOutQuart}
			>
				<p className="mt-2 text-xl text-white/80 2xl:text-2xl">
					{subtitleString}
				</p>
			</ItemEntryWrapper>
		</div>
	);
}
