import Link from "next/link";

export default function AppIcon({
	icon,
	name,
	color,
	bgColor,
	href,
	onClick,
}: {
	icon: React.ReactNode;
	name: string;
	color?: string;
	bgColor?: string;
	href?: string;
	onClick?: () => void;
}) {
	return (
		<Link
			href={href ?? "#"}
			className="flex w-fit flex-col items-center gap-1"
			onClick={onClick}
			data-cy={`app-icon-${name.toLowerCase().replace(/\s+/g, "-")}`}
		>
			<div
				className="cursor-pointer rounded-lg p-2 transition-all duration-200 hover:scale-110"
				style={{
					color: color ?? "white",
					background: bgColor ?? "var(--color-primary)",
				}}
			>
				<div className="flex h-full w-full flex-col items-center justify-center rounded-lg text-center transition-colors duration-200">
					{icon}
				</div>
			</div>
			<p className="w-16 text-center text-sm font-semibold text-wrap">
				{name}
			</p>
		</Link>
	);
}
