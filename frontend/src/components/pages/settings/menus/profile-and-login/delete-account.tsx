import { Button } from "@/components/ui/button";
import { deleteUser, logoutUser } from "@/lib/api/auth";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function DeleteAccountSettings() {
	function handleDeleteAccount() {
		deleteUser().then(() => {
			toast.success("Account deleted successfully. Bye!");
			logoutUser().then(() => {
				redirect("/");
			});
		});
	}

	return (
		<Button
			variant="destructive"
			className="w-full"
			onClick={() => handleDeleteAccount()}
		>
			{"Delete Account"}
		</Button>
	);
}
