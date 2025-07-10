import { useEffect, useState } from "react";

/**
 * Represents the current state of the device's battery.
 */
export type BatteryData = {
	level: number;
	charging: boolean;
	loading: boolean;
	supported: boolean;
};

/**
 * Type declarations for the Battery Status API.
 * Extends the global Navigator interface with battery-related functionality.
 */
declare global {
	interface BatteryManager {
		level: number;
		charging: boolean;
		addEventListener: (
			type: "chargingchange" | "levelchange",
			listener: () => void,
		) => void;
		removeEventListener: (
			type: "chargingchange" | "levelchange",
			listener: () => void,
		) => void;
	}

	interface Navigator {
		getBattery?: () => Promise<BatteryManager>;
	}
}

/**
 * Hook for accessing the device's battery status.
 * Provides real-time updates about battery level and charging state.
 * Falls back gracefully if the Battery Status API is not supported.
 *
 * @returns An object containing:
 * - level: Battery level as a percentage (0-100)
 * - charging: Whether the device is currently charging
 * - loading: Whether the battery status is still being initialized
 * - supported: Whether the Battery Status API is supported
 *
 * @example
 * const { level, charging } = useBattery();
 * // Show battery status
 * console.log(`Battery: ${level}% (${charging ? 'Charging' : 'Not charging'})`);
 */
export default function useBattery(): BatteryData {
	const [data, setData] = useState<BatteryData>({
		level: 0,
		charging: false,
		loading: true,
		supported: true,
	});

	useEffect(() => {
		if (!navigator.getBattery) {
			setData({
				level: 0,
				charging: false,
				loading: false,
				supported: false,
			});
			return;
		}

		let battery: BatteryManager | null = null;

		const isBatteryValid = (bat: BatteryManager) =>
			typeof bat.level === "number" &&
			bat.level >= 0 &&
			bat.level <= 1 &&
			typeof bat.charging === "boolean";

		const updateBatteryStatus = () => {
			if (!battery || !isBatteryValid(battery)) {
				setData({
					level: 0,
					charging: false,
					loading: false,
					supported: false, // treat as unsupported if invalid data
				});
				return;
			}

			setData({
				level: battery.level * 100,
				charging: battery.charging,
				loading: false,
				supported: true,
			});
		};

		navigator
			.getBattery()
			.then((bat) => {
				battery = bat;

				if (!isBatteryValid(battery)) {
					setData({
						level: 0,
						charging: false,
						loading: false,
						supported: false,
					});
					return;
				}

				updateBatteryStatus();

				try {
					battery.addEventListener(
						"levelchange",
						updateBatteryStatus,
					);
					battery.addEventListener(
						"chargingchange",
						updateBatteryStatus,
					);
				} catch {
					// Defensive: Arc might throw if events not supported
				}
			})
			.catch(() => {
				setData({
					level: 0,
					charging: false,
					loading: false,
					supported: false,
				});
			});

		return () => {
			if (battery) {
				try {
					battery.removeEventListener(
						"levelchange",
						updateBatteryStatus,
					);
					battery.removeEventListener(
						"chargingchange",
						updateBatteryStatus,
					);
				} catch {
					// Defensive cleanup: ignore if not supported
				}
			}
		};
	}, []);

	return data;
}
