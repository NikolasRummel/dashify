import { recipeFormDialogOpenState } from "@/atoms/recipes";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalMain,
	ModalTitle,
} from "@/components/ui/modal";
import { useAtom } from "jotai";
import { RecipeForm } from "./RecipeForm";

export default function RecipeFormDialog() {
	const [open, setOpen] = useAtom(recipeFormDialogOpenState);

	return (
		<Modal
			open={open}
			onOpenChange={setOpen}
			desktop="alert_dialog"
			mobile="nested_drawer"
		>
			<ModalContent className="max-h-[85vh] h-fit overflow-y-auto">
				<ModalHeader>
					<ModalTitle>Add Recipe</ModalTitle>
					<ModalDescription>
						Fill in the details of your recipe.
					</ModalDescription>
				</ModalHeader>
				<ModalMain>
					<RecipeForm />
				</ModalMain>
			</ModalContent>
		</Modal>
	);
}
