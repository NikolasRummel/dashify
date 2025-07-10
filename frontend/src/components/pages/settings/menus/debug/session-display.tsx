import { useSession } from "@/hooks/use-session";

export default function SessionDisplay() {
	const session = useSession();
	if (!session) return null;

	return (
		<pre className="w-0 max-w-full wrap-break-word">
			{JSON.stringify(session, null, 2)}
		</pre>
	);
}
