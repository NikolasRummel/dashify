"use client";
import { useSession } from "@/hooks/use-session";

export default function Page() {
	const session = useSession();

	return (
		<div className="text-white">
			<h1>Session Debugging</h1>

			<pre>{JSON.stringify(session, null, 2)}</pre>
		</div>
	);
}
