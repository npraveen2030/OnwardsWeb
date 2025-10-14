// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// You can use this file to set global configuration,
// commands, and behaviors that modify Cypress.
//
// Import commands.js using ES2015 syntax:
// ***********************************************************

// Import custom commands if needed
// import './commands'

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  console.error('Uncaught Exception:', err.message);
  return false;
});
