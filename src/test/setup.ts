// Adds extra matchers like toBeInTheDocument()
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Reset everything after each test so tests don't affect each other
afterEach(() => {
  cleanup();
  localStorage.clear();
});
