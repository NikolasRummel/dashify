import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Copy, Pencil, Trash2 } from "lucide-react";

const RecipeModifyMenu = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger onClick={(e) => e.preventDefault()}>
				<DotsVerticalIcon className={"w-4 h-4"} />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem className="flex items-center gap-2">
					<Pencil className="w-4 h-4" />
					Edit
				</DropdownMenuItem>

				<DropdownMenuItem className="flex items-center gap-2">
					<Copy className="w-4 h-4" />
					Duplicate
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem className="flex items-center gap-2 text-red-500">
					<Trash2 className="w-4 h-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default RecipeModifyMenu;
