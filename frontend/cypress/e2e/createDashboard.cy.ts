describe("create dashboard", () => {
	it("passes", () => {
		//login
		cy.visit("https://dev.dashify.cloud");

		cy.get('input[placeholder="E-Mail"]').clear().type("test@test.de");
		cy.get('input[placeholder="Password"]').clear().type("12345678");
		cy.get(".whitespace-nowrap").click();

		cy.wait(1000);

		cy.get(".items-center > .shrink-0").click();
		cy.get('input[placeholder="Add new dashboard"]').clear();
		cy.get('input[placeholder="Add new dashboard"]').type("test{enter}");

		cy.wait(1000);

		//assert Dashboard created successfully
		cy.contains("Dashboard created successfully").should("be.visible");

		cy.get(".max-w-\\[800px\\] > .size-full").rightclick();
		cy.wait(100);
		cy.get(".focus\\:text-accent-foreground").click();
		cy.wait(100);
		cy.get(".text-red-400").click();
		cy.wait(100);
		cy.get(".inline-flex").click();
		cy.wait(100);
		cy.get(".left-1\\/2").click();

		cy.wait(1000);

		//assert Dashboard deleted successfully
		cy.contains("Dashboard deleted successfully").should("be.visible");
	});
});
