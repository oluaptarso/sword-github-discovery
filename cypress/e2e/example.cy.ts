// https://docs.cypress.io/api/introduction/api.html

describe("Authentication", () => {
  it("visits the app root url", () => {
    cy.visit("/");
    cy.contains("a", "APP");
  });
});
