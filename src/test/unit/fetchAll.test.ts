import { describe, it, expect, vi } from 'vitest';
import { fetchAll } from '../../utils/artworkCRUD';

// UNIT TEST: we test ONE function by itself.
// We don't want a real network call, so we replace `fetch` with a fake one.

describe('fetchAll', () => {
  it('saves the artworks it gets from the API', async () => {
    // fake fetch that returns one artwork
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ id: 1, title: 'Mona Lisa' }] }),
    });

    // vi.fn() creates a "spy": a fake function that remembers how it was called
    const setArtworks = vi.fn();

    await fetchAll(vi.fn(), vi.fn(), 'https://api.test/', 1, setArtworks);

    expect(setArtworks).toHaveBeenCalledWith([{ id: 1, title: 'Mona Lisa' }]);
  });

  it('sets an error message when the request fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    const setError = vi.fn();

    await fetchAll(vi.fn(), setError, 'https://api.test/', 1, vi.fn());

    expect(setError).toHaveBeenCalledWith(
      'Failed to load artworks. Please try again later.'
    );
  });
});
