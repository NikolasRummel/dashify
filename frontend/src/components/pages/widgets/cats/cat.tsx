"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import AnimatedWidgetBackground from "../shared/animated-widget-background";

export default function CatWidget() {
	const [image, setImage] = useState<string>();

	useEffect(() => {
		const fetchImage = async () => {
			try {
				const response = await axios.get(
					"https://cataas.com/cat?json=true",
				);
				setImage(response.data.url);
			} catch (error) {
				console.error("Error fetching image:", error);
			}
		};

		fetchImage();
		const interval = setInterval(fetchImage, 15000);
		return () => clearInterval(interval);
	}, []);

	if (!image) return;

	return (
		<AnimatedWidgetBackground
			src={image}
			alt="Image of a cat"
		/>
	);
}
