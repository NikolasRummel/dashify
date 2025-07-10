// app/components/AuthContextProvider.tsx
"use client";

import { createContext, useState } from "react";
import { Session } from "@/types/auth";

interface AuthContextValue {
	session: Session;
	setSession: (session: Session) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
	undefined,
);

export default function AuthContextProvider({
	initialSession,
	children,
}: {
	initialSession: Session;
	children: React.ReactNode;
}) {
	const [session, setSession] = useState<Session>({
		...initialSession,
		status: "loading",
	});

	return (
		<AuthContext.Provider value={{ session, setSession }}>
			{children}
		</AuthContext.Provider>
	);
}
