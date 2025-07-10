"use client";

import { useEffect, useState } from "react";
import { healthcheck } from "@/lib/api/healthcheck";
import Image from "next/image";

export default function HealthCheckWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isHealthy, setIsHealthy] = useState<boolean>(true);

	useEffect(() => {
		console.log("Performing healthcheck...");
		healthcheck()
			.then(() => {
				console.log("Healthcheck passed");
				setIsHealthy(true);
			})
			.catch((error) => {
				console.error("Healthcheck failed:", error);
				setIsHealthy(false);
			});
	}, []);

	if (!isHealthy) {
		return (
			<div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
				<Image
					src="/database.png"
					alt="Database Error Icon"
					width={100}
					height={100}
				/>
				<h1 className="text-2xl font-bold text-white">
					Backend Connection Error
				</h1>
				<p className="text-secondary-foreground w-96 text-center text-lg text-balance">
					Could not connect to the backend. <br />
					Please check the connection and try again.
				</p>
				<pre>
					{process.env.NEXT_PUBLIC_BACKEND_URL ||
						"NEXT_PUBLIC_BACKEND_URL is not set"}
				</pre>
			</div>
		);
	}

	return <>{children}</>;
}
