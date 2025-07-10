"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import AnimatedWidgetBackground from "../shared/animated-widget-background";

export default function DogWidget() {
	const [image, setImage] = useState<string>();

	useEffect(() => {
		const fetchImage = async () => {
			try {
				const response = await axios.get(
					"https://dog.ceo/api/breeds/image/random",
				);
				setImage(response.data.message);
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
			alt="Image of a dog"
		/>
	);
}
