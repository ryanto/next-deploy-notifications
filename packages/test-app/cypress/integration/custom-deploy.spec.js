/// <reference types="cypress" />

describe("Custom deploy", () => {
  it("it should see the new deploy message", () => {
    cy.setAppVersion("1");

    cy.visit("/examples/custom-version");

    cy.contains("There is a new deploy!").should("not.exist");

    cy.wait(2000);

    cy.setAppVersion("2");

    cy.contains("There is a new deploy!").should("exist");
  });

  it("it should show the current version of the application", () => {
    cy.setAppVersion("123");

    cy.visit("/examples/custom-version");

    cy.get("[data-test=current-version]").contains("123").should("exist");
  });
});
