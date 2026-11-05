import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Home from '../../pages/Home';

// INTEGRATION TEST: we render a whole page.
// Home + fetchAll + Card all work together here.
// Only the API is fake, so the test doesn't need the internet.

const fakeArtworks = [
  { id: 1, title: 'Water Lilies', creators: [{ description: 'Monet' }], images: null },
  { id: 2, title: 'The Starry Night', creators: [{ description: 'Van Gogh' }], images: null },
];

beforeEach(() => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: fakeArtworks }),
  });
});

describe('Home page', () => {
  it('loads artworks and shows them as cards', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // findBy... WAITS for the element to appear (the fetch is async)
    expect(await screen.findByText(/Water Lilies/)).toBeInTheDocument();
    expect(screen.getByText(/The Starry Night/)).toBeInTheDocument();
  });

  it('shows only matching artworks after a search', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    await screen.findByText(/Water Lilies/);

    await userEvent.type(screen.getByPlaceholderText('Search artworks...'), 'starry');
    await userEvent.click(screen.getByText('Search'));

    expect(await screen.findByText(/The Starry Night/)).toBeInTheDocument();
    expect(screen.queryByText(/Water Lilies/)).not.toBeInTheDocument();
  });
});
