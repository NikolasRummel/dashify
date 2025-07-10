import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/hooks/use-session";
import Image from "next/image";

export default function UserAvatar({
	size = 48,
	className,
}: {
	size?: number;
	className?: string;
}) {
	const { user } = useSession();

	return (
		<Avatar
			style={{ width: size, height: size }}
			className={`cursor-pointer border-white/40 transition-colors duration-500 select-none hover:border-white/60 ${className}`}
		>
			<AvatarImage
				src={user?.profilePicture}
				alt={`${user?.username}'s Avatar`}
			/>
			<AvatarFallback className="relative">
				<Image
					src="/default-profile-image.svg"
					alt="User Avatar"
					fill
				/>
			</AvatarFallback>
		</Avatar>
	);
}
