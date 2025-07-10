import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		experimentalStudio: true,
		baseUrl: "https://dev.dashify.cloud",
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
});
