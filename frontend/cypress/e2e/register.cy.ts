/// <reference types="cypress" />

describe("register", () => {
	it("passes", () => {
		cy.visit("https://dev.dashify.cloud");

		// Wait for the page and the form to load
		cy.get("b").should("be.visible").click();

		const random = "cy-" + new Date().getTime();
		const user = random.substring(0, 15);
		const email = user + "@c.de";

		// Fill out the form with proper waits
		cy.get('input[placeholder="Username"]')
			.should("be.visible")
			.and("not.be.disabled")
			.clear()
			.type(user);

		cy.get('input[placeholder="E-Mail"]')
			.should("be.visible")
			.and("not.be.disabled")
			.clear()
			.type(email);

		cy.get('input[placeholder="Password"]')
			.should("be.visible")
			.and("not.be.disabled")
			.clear()
			.type("test12345");

		cy.get('input[placeholder="Confirm password"]')
			.should("be.visible")
			.and("not.be.disabled")
			.clear()
			.type("test12345");

		// Submit the form
		cy.get(".whitespace-nowrap > .duration-500")
			.should("be.visible")
			.click();

		// Assert toast success message
		cy.contains("Account created successfully!", { timeout: 5000 }).should(
			"be.visible",
		);
	});
});
