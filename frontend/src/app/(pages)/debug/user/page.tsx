"use client";

import { useSession } from "@/hooks/use-session";
import Image from "next/image";

export default function Page() {
	const session = useSession();

	return (
		<div className="text-white">
			<h1>User Debugging</h1>
			<Image
				src={session.user?.profilePicture || ""}
				alt="User Profile Picture"
				className="rounded-full"
				width={100}
				height={100}
			/>
			<pre>{JSON.stringify(session, null, 2)}</pre>

			{/* <ProfileTabContent /> */}
		</div>
	);
}
