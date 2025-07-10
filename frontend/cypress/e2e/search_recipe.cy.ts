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
		cy.get(".w-full > .w-12 > svg").click();
		cy.wait(250);
		cy.get(".z-100 > div.h-full > .w-full").type("Awdawd{enter}");
		cy.wait(250);
		cy.contains("Can't find what you're looking for?").should("be.visible"); //because of animations a suggestion could not be tested
	});
});
