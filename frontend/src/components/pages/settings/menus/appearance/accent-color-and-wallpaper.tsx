import BackgroundPicker from "@/components/pages/background/BackgroundPicker";
import { Button } from "@/components/ui/button";
import {
	ColorPicker,
	ColorPickerAlpha,
	ColorPickerEyeDropper,
	ColorPickerFormat,
	ColorPickerHue,
	ColorPickerOutput,
	ColorPickerSelection,
} from "@/components/ui/color-picker";
import {
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalMain,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import ItemEntryWrapper from "@/components/wrappers/motion/entry-wrapper";
import { useSession } from "@/hooks/use-session";
import { easeOutQuart } from "@/lib/motion";
import { SessionWithUpdate } from "@/types/auth";
import Color, { ColorLike } from "color";
import { extractColors } from "extract-colors";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FaImage } from "react-icons/fa6";

const colors = [
	"#dc2626",
	"#f97316",
	"#f59e0b",
	"#facc15",
	"#84cc16",
	"#22c55e",
	"#10b981",
	"#14b8a6",
	"#06b6d4",
	"#0ea5e9",
	"#3b82f6",
	"#6366f1",
	"#8b5cf6",
	"#a855f7",
	"#d946ef",
	"#ec4899",
	"#f43f5e",
];

const variants = {
	hidden: {
		scale: 0.7,
		opacity: 0,
		filter: "blur(8px) brightness(4)",
		x: -48,
	},
	visible: {
		scale: 1,
		opacity: 1,
		filter: "blur(0px) brightness(1)",
		x: 0,
	},
};
export default function AccentAndWallpaperColorSettings() {
	const { user, update } = useSession();

	return (
		<div className="flex flex-col gap-4">
			<BackgroundPicker>
				<Button
					className="w-44 justify-start"
					variant="outline"
				>
					<FaImage /> Change Wallpaper
				</Button>
			</BackgroundPicker>
			<motion.div
				layout
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{
					duration: 0.5,
					ease: easeOutQuart,
				}}
				className="flex flex-row gap-1.5 rounded-full overflow-x-auto h-9 items-center"
			>
				<ColorPickerModal
					user={user}
					update={update}
				/>
				<ColorFromWallpaperButton
					user={user}
					update={update}
				/>
				{colors.map((color, index) => (
					<div
						key={index}
						className="aspect-square h-8 hover:scale-110 transition-transform duration-300"
					>
						<ItemEntryWrapper
							variants={variants}
							ease={easeOutQuart}
							duration={1}
							delay={index * 0.025}
							className={`aspect-square h-full shrink-0 rounded-full border-2 border-primary/50 hover:border-primary/70 cursor-pointer transition-colors ${color === user?.accentColor ? "border-primary!" : ""}`}
							style={{ backgroundColor: color }}
							onClick={() => {
								update({
									accentColor: color,
								});
							}}
						/>
					</div>
				))}
			</motion.div>
		</div>
	);
}

function ColorFromWallpaperButton({
	user,
	update,
}: {
	user: SessionWithUpdate["user"];
	update: SessionWithUpdate["update"];
}) {
	const [color, setColor] = useState<string>();

	useEffect(() => {
		if (user?.backgroundImage) {
			extractColors(user?.backgroundImage).then((colors) => {
				if (colors.length > 0) {
					const c = new Color(colors[0].hex);
					const newColor = c.lighten(0.2);
					setColor(newColor.hexa());
				}
			});
		}
	}, [user?.backgroundImage]);

	return (
		<ItemEntryWrapper
			variants={variants}
			ease={easeOutQuart}
			duration={1}
		>
			<div
				style={{ backgroundColor: color }}
				className="flex items-center justify-center aspect-square h-8 shrink-0 rounded-full border-2 border-primary/50 hover:border-primary/70 cursor-pointer transition-all hover:scale-110"
				onClick={() => {
					update({
						accentColor: color,
					});
				}}
			>
				<FaImage size={14} />
			</div>
		</ItemEntryWrapper>
	);
}

function ColorPickerModal({
	user,
	update,
}: {
	user: SessionWithUpdate["user"];
	update: SessionWithUpdate["update"];
}) {
	const [color, setColor] = useState(user?.accentColor || "#ff0000");

	useEffect(() => {
		if (user?.accentColor) {
			setColor(user?.accentColor);
		}
	}, [user, update]);

	return (
		<Modal
			desktop="popover"
			mobile="nested_drawer"
		>
			<ModalTrigger>
				<ItemEntryWrapper
					variants={variants}
					ease={easeOutQuart}
					duration={1}
				>
					<div
						style={{ backgroundColor: color }}
						className="flex items-center justify-center aspect-square h-8 shrink-0 rounded-full border-2 border-primary/50 hover:border-primary/70 cursor-pointer transition-all hover:scale-110"
					>
						<AiFillEdit />
					</div>
				</ItemEntryWrapper>
			</ModalTrigger>
			<ModalContent>
				<ModalHeader className="md:sr-only">
					<ModalTitle>Accent Color</ModalTitle>
					<ModalDescription>
						Choose your preferred accent color for the dashboard.
					</ModalDescription>
				</ModalHeader>
				<ModalMain className="flex items-center">
					<ColorPicker
						className="w-full max-w-96"
						defaultValue={color}
						onChange={(color: ColorLike) => {
							const c = new Color(color);
							setColor(c.hexa());
						}}
					>
						<ColorPickerSelection className="rounded-2xl" />
						<div className="flex items-center gap-4">
							<ColorPickerEyeDropper />
							<div className="w-full grid gap-1">
								<ColorPickerHue />
								<ColorPickerAlpha />
							</div>
						</div>
						<div className="flex items-center gap-2">
							<ColorPickerOutput />
							<ColorPickerFormat />
						</div>
					</ColorPicker>
				</ModalMain>
				<ModalFooter>
					<ModalClose
						className="w-full mt-4 rounded-2xl"
						onClick={() => {
							update({
								accentColor: color,
							});
						}}
					>
						Save
					</ModalClose>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
