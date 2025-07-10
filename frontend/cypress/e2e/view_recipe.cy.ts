describe("template spec", () => {
	it("passes", () => {
		cy.visit("https://dev.dashify.cloud");

		cy.get('input[placeholder="E-Mail"]').clear().type("test@test.de");
		cy.get('input[placeholder="Password"]').clear().type("12345678");
		cy.get(".whitespace-nowrap").click();

		cy.wait(1000);

		cy.get('[data-cy="app-list-menu"]').click();
		cy.wait(250);
		cy.get('[data-cy="app-icon-recipes"]').click();
		cy.wait(250);
		cy.contains("My Recipes").should("be.visible");
		cy.wait(250);
		cy.contains("Explore").click();
		cy.wait(250);
		cy.contains("My Recipes").should("be.visible");
		cy.wait(250);
		cy.contains("Spaghetti Carbonara").click();
		cy.wait(1000);
		cy.contains(
			"Classic Italian pasta dish with egg, cheese, pancetta, and pepper.",
		).should("be.visible");
	});
});
