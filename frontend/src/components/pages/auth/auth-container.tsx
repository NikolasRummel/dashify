"use client";

import { motion, AnimatePresence } from "motion/react";
import Login from "./steps/login";
import Register from "./steps/register";
import { authenticationFormSelectedTabAtom, authHideForm } from "@/atoms/login";
import ForgotPassword from "./steps/forgot-password";
import { useAtomValue, useSetAtom } from "jotai";
import ItemEntryWrapper from "@/components/wrappers/motion/entry-wrapper";
import { easeOutQuart } from "@/lib/motion";
import { dashboardBackgroundState } from "@/atoms/dashboard";
import { DEFAULT_BACKGROUND } from "@/lib/backgrounds";
import { useEffect } from "react";

export default function AuthContainer() {
	const selectedTab = useAtomValue(authenticationFormSelectedTabAtom);
	const hidden = useAtomValue(authHideForm);
	const setBackground = useSetAtom(dashboardBackgroundState);

	useEffect(() => {
		setBackground(DEFAULT_BACKGROUND);
	}, [setBackground]);

	return (
		<ItemEntryWrapper
			variants={{
				hidden: {
					background:
						"color-mix(in oklab, rgba(0, 0, 0, 0.2) 20%, transparent)",
				},
				visible: {
					background:
						"color-mix(in oklab, var(--color-popover) 10%, transparent)",
				},
			}}
			ease={easeOutQuart}
			duration={3}
			className={`flex h-full w-full items-center justify-center backdrop-blur-xl transition-all duration-300 ${hidden && "opacity-0 backdrop-blur-none"}`}
		>
			<AnimatePresence mode="wait">
				<motion.div
					key={selectedTab ? selectedTab : "empty"}
					initial={{
						x: -10,
						opacity: 0,
						filter: "blur(4px)",
					}}
					animate={{
						x: 0,
						opacity: 1,
						filter: "blur(0px)",
					}}
					exit={{
						x: 10,
						opacity: 0,
						filter: "blur(4px)",
					}}
					transition={{ duration: 0.2 }}
					className="w-96"
				>
					{selectedTab === "login" && <Login />}
					{selectedTab === "register" && <Register />}
					{selectedTab === "forgot-password" && <ForgotPassword />}
				</motion.div>
			</AnimatePresence>
		</ItemEntryWrapper>
	);
}
