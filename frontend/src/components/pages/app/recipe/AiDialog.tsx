import { aiDialogOpenState } from "@/atoms/recipes";
import {
	Modal,
	ModalContent,
	ModalMain,
	ModalTitle,
} from "@/components/ui/modal";
import { useAtom } from "jotai";
import AiPrompt from "./AiPrompt";

export default function AiDialog() {
	const [open, setOpen] = useAtom(aiDialogOpenState);

	return (
		<Modal
			open={open}
			onOpenChange={setOpen}
		>
			<ModalContent className="md:w-fit px-8">
				<ModalTitle className="sr-only">
					Generate Recipe with AI
				</ModalTitle>
				<ModalMain className="flex flex-col justify-center items-center">
					<AiPrompt />
				</ModalMain>
			</ModalContent>
		</Modal>
	);
}
