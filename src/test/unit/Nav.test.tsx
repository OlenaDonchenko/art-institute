import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Nav from '../../components/Nav';

// Components that use <Link> must be inside a router.
// MemoryRouter is a router made for tests.

describe('Nav', () => {
  it('shows the Home and My Fav links', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('My Fav')).toBeInTheDocument();
  });
});
