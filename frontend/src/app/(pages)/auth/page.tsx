import { redirect } from "next/navigation";
import AuthContainer from "@/components/pages/auth/auth-container";
import { auth } from "@/hooks/auth";

export default async function Login() {
	const { status } = await auth();

	if (status === "authenticated") {
		return redirect("/");
	}

	return <AuthContainer />;
}
