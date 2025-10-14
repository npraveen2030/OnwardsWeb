describe('LoginComponent E2E', () => {
  beforeEach(() => {
    // Point to your Angular app's dev server
    cy.visit('http://localhost:4200/');
  });

  it('should display login form with username and password', () => {
    cy.get('input#username').should('exist').and('have.attr', 'placeholder', 'Employee Code');
    cy.get('input#password').should('exist').and('have.attr', 'placeholder', 'Password');
    cy.get('button[type="submit"]').contains('Login');
  });

  it('should show error when trying to login with empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Employee Code*'); // field still required
  });

  it('should attempt login with valid credentials', () => {
    // Replace with your test credentials or mock API
    cy.get('input#username').type('EMP001');
    cy.get('input#password').type('password');
    cy.get('button[type="submit"]').click();

    // Expect navigation to dashboard
    cy.url().should('include', '/dashboard');
  });

  it('should show error on invalid credentials', () => {
    cy.get('input#username').type('wronguser');
    cy.get('input#password').type('wrongpass');
    cy.get('button[type="submit"]').click();

    // Expect error message in DOM
    cy.get('.text-danger').should('contain.text', 'An error occurred. Please try again.');
  });
});
