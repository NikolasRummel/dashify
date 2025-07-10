/*
 * MODAL COMPONENT
 * -------------------------
 * Component that wraps Drawer, AlertDialog, Dialog, and Popover components to
 * provide a consistent and responsive API for modals of all types.
 */
"use client";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerNestedRoot,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import useIsMobile from "@/hooks/use-is-mobile";
import React, {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { Drawer as DrawerPrimitive } from "vaul";

export type ModalProps = React.HTMLAttributes<HTMLElement> &
	React.ComponentProps<typeof DrawerPrimitive.Root>;
export type ModalVariant =
	| "drawer"
	| "nested_drawer"
	| "alert_dialog"
	| "dialog"
	| "popover";

const VariantContext = createContext<{
	variant: ModalVariant;
	setVariant: React.Dispatch<React.SetStateAction<ModalVariant>>;
}>({
	variant: "dialog",
	setVariant: () => {},
});

export function Modal({
	desktop = "dialog",
	mobile = "drawer",
	children,
	...props
}: {
	desktop?: ModalVariant;
	mobile?: ModalVariant;
} & ModalProps) {
	const isMobile = useIsMobile();
	const [variant, setVariant] = useState<ModalVariant>(
		isMobile ? mobile : desktop,
	);

	useEffect(() => {
		setVariant(isMobile ? mobile : desktop);
	}, [isMobile, mobile, desktop]);

	const ModalComponent = {
		drawer: Drawer,
		nested_drawer: DrawerNestedRoot,
		alert_dialog: AlertDialog,
		dialog: Dialog,
		popover: Popover,
	}[variant];

	return (
		<VariantContext.Provider value={{ variant, setVariant }}>
			<ModalComponent {...props}>{children}</ModalComponent>
		</VariantContext.Provider>
	);
}

export function ModalHeader({
	children,
	...props
}: PropsWithChildren<ModalProps>) {
	const { variant } = useContext(VariantContext);
	const HeaderComponent = {
		drawer: DrawerHeader,
		nested_drawer: DrawerHeader,
		alert_dialog: AlertDialogHeader,
		dialog: DialogHeader,
		popover: "div",
	}[variant];

	return <HeaderComponent {...props}>{children}</HeaderComponent>;
}

export function ModalContent({
	children,
	...props
}: PropsWithChildren<ModalProps>) {
	const { variant } = useContext(VariantContext);
	const ContentComponent = {
		drawer: DrawerContent,
		nested_drawer: DrawerContent,
		alert_dialog: AlertDialogContent,
		dialog: DialogContent,
		popover: PopoverContent,
	}[variant];

	return (
		<ContentComponent className={props.className}>
			{children}
		</ContentComponent>
	);
}

export function ModalMain({
	children,
	className,
	...props
}: PropsWithChildren<ModalProps>) {
	const { variant } = useContext(VariantContext);

	return (
		<div
			className={`flex h-full w-full flex-col gap-3 ${variant === "drawer" || (variant === "nested_drawer" && "mb-4 px-4")} ${className}`}
			{...props}
		>
			{children}
		</div>
	);
}

export function ModalFooter({
	children,
	...props
}: PropsWithChildren<ModalProps>) {
	const { variant } = useContext(VariantContext);
	const FooterComponent = {
		drawer: DrawerFooter,
		nested_drawer: DrawerFooter,
		alert_dialog: AlertDialogFooter,
		dialog: DialogFooter,
		popover: "div",
	}[variant];

	return <FooterComponent {...props}>{children}</FooterComponent>;
}

export function ModalTitle({
	children,
	...props
}: PropsWithChildren<ModalProps>) {
	const { variant } = useContext(VariantContext);
	const TitleComponent = {
		drawer: DrawerTitle,
		nested_drawer: DrawerTitle,
		alert_dialog: AlertDialogTitle,
		dialog: DialogTitle,
		popover: "div",
	}[variant];

	return <TitleComponent {...props}>{children}</TitleComponent>;
}

export function ModalDescription({
	children,
	...props
}: PropsWithChildren<ModalProps>) {
	const { variant } = useContext(VariantContext);
	const DescriptionComponent = {
		drawer: DrawerDescription,
		nested_drawer: DrawerDescription,
		alert_dialog: AlertDialogDescription,
		dialog: DialogDescription,
		popover: "div",
	}[variant];

	return <DescriptionComponent {...props}>{children}</DescriptionComponent>;
}

export function ModalTrigger({
	children,
	...props
}: PropsWithChildren<ModalProps>) {
	const { variant } = useContext(VariantContext);
	const TriggerComponent = {
		drawer: DrawerTrigger,
		nested_drawer: DrawerTrigger,
		alert_dialog: AlertDialogTrigger,
		dialog: DialogTrigger,
		popover: PopoverTrigger,
	}[variant];

	return (
		<TriggerComponent
			asChild
			{...props}
		>
			{children}
		</TriggerComponent>
	);
}

export type ModalCloseProps = ModalProps & {
	variant?: ButtonProps["variant"];
	disabled?: boolean;
};

export function ModalClose({
	children,
	variant,
	...props
}: PropsWithChildren<ModalCloseProps>) {
	const { variant: modalVariant } = useContext(VariantContext);

	switch (modalVariant) {
		case "drawer":
			return (
				<DrawerClose asChild>
					<Button
						variant={variant}
						{...props}
					>
						{children}
					</Button>
				</DrawerClose>
			);
		case "alert_dialog":
			return <AlertDialogCancel {...props}>{children}</AlertDialogCancel>;
		case "popover":
			return (
				<Button
					variant={variant}
					{...props}
				>
					{children}
				</Button>
			);
		default:
			return (
				<DialogClose asChild>
					<Button
						variant={variant}
						{...props}
					>
						{children}
					</Button>
				</DialogClose>
			);
	}
}

export type ModalActionProps = ModalProps & ButtonProps;

export function ModalAction({
	children,
	...props
}: PropsWithChildren<ModalActionProps>) {
	return <Button {...props}>{children}</Button>;
}
