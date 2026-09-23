describe('Cloud Weather Intelligence Platform - E2E Verification', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders synoptic current weather card and metrics', () => {
    cy.contains('Cloud Weather Intelligence').should('be.visible');
    cy.contains('Feels Like').should('be.visible');
    cy.contains('Barometric Pressure').should('be.visible');
  });

  it('allows switching temperature unit from C to F', () => {
    cy.contains('°C').click();
    cy.contains('°F').should('be.visible');
  });

  it('navigates between Dashboard, Favorites, Operations, and Release Center', () => {
    cy.contains('Operations').click();
    cy.contains('Cloud Infrastructure Operations & Telemetry').should('be.visible');

    cy.contains('Release Center').click();
    cy.contains('Azure DevOps Release Center').should('be.visible');

    cy.contains('Dashboard').click();
    cy.contains('Synoptic Atmospheric Metrics').should('be.visible');
  });
});
