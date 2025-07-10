"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

const Drawer = ({
	shouldScaleBackground = true,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
	<DrawerPrimitive.Root
		shouldScaleBackground={shouldScaleBackground}
		{...props}
	/>
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerNestedRoot = DrawerPrimitive.NestedRoot;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Overlay
		ref={ref}
		className={cn(
			"bg-background/50 fixed inset-0 z-50 backdrop-blur-sm!",
			className,
		)}
		{...props}
	/>
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
		showOverlay?: boolean;
	}
>(({ className, children, showOverlay = true, ...props }, ref) => (
	<DrawerPortal>
		{showOverlay && <DrawerOverlay />}
		<DrawerPrimitive.Content
			ref={ref}
			className={cn(
				"bg-popover/80 w-full backdrop-blur-xl border-border/70 fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto rounded-t-[16px]  flex-col border outline-hidden",
				className,
			)}
			{...props}
		>
			{children}
		</DrawerPrimitive.Content>
	</DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerContentWithHeader = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
		showOverlay?: boolean;
		header?: React.ReactNode;
	}
>(({ className, children, header, showOverlay = true, ...props }, ref) => (
	<DrawerPortal>
		{showOverlay && <DrawerOverlay />}
		<DrawerPrimitive.Content
			ref={ref}
			className={cn(
				"bg-popover/80 border-border/70 fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto rounded-t-[16px]  flex-col border outline-hidden",
				className,
			)}
			{...props}
		>
			{header}
			<div className="w-full h-full backdrop-blur-xl rounded-t-[16px] ">
				{children}
			</div>
		</DrawerPrimitive.Content>
	</DrawerPortal>
));
DrawerContentWithHeader.displayName = "DrawerContentWithHeader";

DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn("grid gap-1.5 p-4 text-center", className)}
		{...props}
	/>
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn("mt-auto flex flex-col gap-2 p-4", className)}
		{...props}
	/>
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Title
		ref={ref}
		className={cn(
			"text-lg leading-none font-semibold tracking-tight",
			className,
		)}
		{...props}
	/>
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Description
		ref={ref}
		className={cn("text-muted-foreground text-sm", className)}
		{...props}
	/>
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerContentWithHeader,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerNestedRoot,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
};
