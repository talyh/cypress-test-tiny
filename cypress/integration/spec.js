/// <reference types="cypress" />
describe("page", () => {
  it("works", () => {
    cy.visit("https://example.cypress.io");

    // a regular ol' function folks
    function req() {
      cy.request("https://pokeapi.co/api/v2/pokemon/eevee").then((resp) => {
        // if we got what we wanted

        if (resp.status === 200 && resp.body.ok === true)
          // break out of the recursive loop
          return;

        // else recurse
        req();
      });
    }

    cy
      // do the thing causing the side effect
      .get(
        ":nth-child(4) > .row > .col-xs-12 > .home-list > :nth-child(1) > ul > :nth-child(1) > a"
      )
      .click()

      // now start the requests
      // expected behaviour is that we'd allow 1ms for the whole `req`, to avoid it polling forever if the endpoint is down
      // however, the actual result is that we wait 1ms for each req execution
      // also worth noting, that I find value in being able to determine the timeout for each execution, but I'd do that in the
      // `then` inside the `cy.request` in line 8
      // this timeout here for me should represent the `whole operation` timeout
      .then({ timeout: 1 }, req);
  });
});
