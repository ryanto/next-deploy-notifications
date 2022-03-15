/// <reference types="cypress" />

describe("New deploy", () => {
  it("it should show the current git sha as the version", () => {
    cy.visit("/examples/git-version");

    cy.exec("git rev-parse HEAD").then(({ stdout }) => {
      expect(stdout).to.exist;
      cy.get("[data-test=current-version]").contains(stdout).should("exist");
    });
  });
});
