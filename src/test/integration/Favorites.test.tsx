import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

// INTEGRATION TEST: the whole app, like a real user.
// Home page -> click "Add to fav" -> go to "My Fav" -> click "remove"

describe('Favorites flow', () => {
  it('adds an artwork to favorites and removes it again', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          { id: 1, title: 'Water Lilies', creators: [{ description: 'Monet' }], images: null },
        ],
      }),
    });

    render(<App />);

    // 1. add to favorites on the Home page
    await userEvent.click(await screen.findByText('Add to fav'));

    // 2. go to the My Fav page
    await userEvent.click(screen.getByText('My Fav'));
    expect(screen.getByText(/Water Lilies/)).toBeInTheDocument();

    // 3. remove it
    await userEvent.click(screen.getByText('remove'));
    expect(screen.queryByText(/Water Lilies/)).not.toBeInTheDocument();
  });
});
