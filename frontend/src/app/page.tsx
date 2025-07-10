import { auth } from "@/hooks/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
	const { status } = await auth();

	if (status === "authenticated") {
		return redirect("/dashboard");
	}
	if (status === "unauthenticated") {
		return redirect("/auth");
	}
}
