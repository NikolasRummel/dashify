describe("login", () => {
	it("passes", () => {
		cy.clearCookies();

		cy.visit("https://dev.dashify.cloud");

		cy.get('input[placeholder="E-Mail"]').clear().type("test@test.de");
		cy.get('input[placeholder="Password"]').clear().type("12345678");
		cy.get(".whitespace-nowrap").click();

		cy.wait(1000);
		cy.getCookie("dashify_token").should("exist");
	});
});
