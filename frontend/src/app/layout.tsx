export const dynamic = "force-dynamic";

import Background from "@/components/pages/background/Background";
import { Toaster } from "@/components/ui/sonner";
import AuthContextProvider from "@/components/wrappers/auth/auth-context-provider";
import HealthCheckWrapper from "@/components/wrappers/healthcheck";
import { ThemeProvider } from "@/components/wrappers/themes/theme-provider";
import { auth } from "@/hooks/auth";
import { Provider as JotaiProvider } from "jotai";
import type { Metadata } from "next";
import { Antonio, Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";

const GeistSans = Geist({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const GeistMono = Geist_Mono({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const NunitoSans = Nunito({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const AntonioSans = Antonio({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Dashify",
	description: "A fitness oriented dashboard application.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body
				className={`${GeistSans.className} ${GeistMono.className} ${NunitoSans.className} ${AntonioSans.className} h-screen bg-black antialiased`}
			>
				<AuthContextProvider initialSession={session}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
					>
						<JotaiProvider>
							<main
								vaul-drawer-wrapper=""
								className="h-full w-full"
							>
								<Background>
									<HealthCheckWrapper>
										{children}
										<Toaster />
									</HealthCheckWrapper>
								</Background>
							</main>
						</JotaiProvider>
					</ThemeProvider>
				</AuthContextProvider>
			</body>
		</html>
	);
}
