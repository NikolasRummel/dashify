import { auth } from "@/hooks/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { status } = await auth();

	if (status === "unauthenticated") {
		return redirect("/");
	}

	return <>{children}</>;
}
