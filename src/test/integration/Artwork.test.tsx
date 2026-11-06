import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import Artwork from '../../pages/Artwork';

// The Artwork page reads the `id` from the URL (/artwork/:id),
// so we need a router with the same route as in App.tsx.
// `initialEntries` is the browser history: we start on "/" and then open the artwork.

const renderArtwork = () =>
  render(
    <MemoryRouter initialEntries={['/', '/artwork/42']}>
      <Routes>
        <Route path="/" element={<p>Home page</p>} />
        <Route path="/artwork/:id" element={<Artwork />} />
      </Routes>
    </MemoryRouter>
  );

// helper: make the fake API answer with `body`
const mockApi = (body: unknown) => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => body,
  });
};

beforeEach(() => {
  mockApi({
    data: {
      title: 'Water Lilies',
      creators: [{ description: 'Monet' }],
      images: { web: { url: 'lilies.jpg' } },
    },
  });
  // the page logs the data with console.log, hide it
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('Artwork page', () => {
  it('asks the API for the artwork with the id from the URL', async () => {
    renderArtwork();
    await screen.findByText(/Water Lilies/);

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/artworks/42'));
  });

  it('shows the title, artist and image', async () => {
    renderArtwork();

    expect(await screen.findByText('Water Lilies — Monet')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'lilies.jpg');
  });

  it('still shows the title when the artwork has no image', async () => {
    mockApi({ data: { title: 'Sketch', creators: [], images: null } });
    renderArtwork();

    expect(await screen.findByText(/Sketch/)).toBeInTheDocument();
    expect(screen.getByRole('img')).not.toHaveAttribute('src');
  });

  it('goes back to the previous page when "go back" is clicked', async () => {
    renderArtwork();
    await screen.findByText(/Water Lilies/);

    await userEvent.click(screen.getByText('go back'));

    expect(screen.getByText('Home page')).toBeInTheDocument();
  });
});
