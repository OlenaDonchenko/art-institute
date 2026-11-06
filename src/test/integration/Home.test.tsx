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

// helper: make the fake API answer with `body`
const mockApi = (body: unknown) => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => body,
  });
};

// helper: show the Home page inside a test router
const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

// helper: type in the search box and press "Search"
const search = async (text: string) => {
  await userEvent.type(screen.getByPlaceholderText('Search artworks...'), text);
  await userEvent.click(screen.getByText('Search'));
};

beforeEach(() => {
  mockApi({ data: fakeArtworks });
  // the page logs errors with console.error, hide them to keep the output clean
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// ---------------------------------------------------------------
describe('Home page: good data', () => {
  it('loads artworks and shows them as cards', async () => {
    renderHome();

    // findBy... WAITS for the element to appear (the fetch is async)
    expect(await screen.findByText(/Water Lilies/)).toBeInTheDocument();
    expect(screen.getByText(/The Starry Night/)).toBeInTheDocument();
  });

  it('shows the artist name next to the title', async () => {
    renderHome();

    expect(await screen.findByText('Water Lilies — Monet')).toBeInTheDocument();
  });

  it('shows the image when the artwork has one', async () => {
    mockApi({
      data: [{ ...fakeArtworks[0], images: { web: { url: 'lilies.jpg' } } }],
    });
    renderHome();

    expect(await screen.findByRole('img')).toHaveAttribute('src', 'lilies.jpg');
  });

  it('asks the API for page 1 when the page opens', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('skip=0'));
  });

  it('shows a loading message while waiting for the API', () => {
    // a fetch that never finishes, so the page stays "loading"
    globalThis.fetch = vi.fn(() => new Promise(() => {})) as typeof fetch;
    renderHome();

    expect(screen.getByText('Searching artworks...')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------
describe('Home page: empty data', () => {
  it('shows "No artworks found." when the API sends no data', async () => {
    // this time the API answers with NO data at all
    mockApi({});
    renderHome();

    expect(await screen.findByText('No artworks found.')).toBeInTheDocument();

    // neither of the two artworks should be on the page
    expect(screen.queryByText(/Water Lilies/)).not.toBeInTheDocument();
    expect(screen.queryByText(/The Starry Night/)).not.toBeInTheDocument();
  });

  it('shows "No artworks found." when data is an empty list', async () => {
    mockApi({ data: [] });
    renderHome();

    expect(await screen.findByText('No artworks found.')).toBeInTheDocument();
  });

  it('shows "No artworks found." when data is null', async () => {
    mockApi({ data: null });
    renderHome();

    expect(await screen.findByText('No artworks found.')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------
describe('Home page: bad data', () => {
  it('still shows the title when the artwork has no creators', async () => {
    mockApi({ data: [{ id: 1, title: 'Unknown Artist Piece', creators: [], images: null }] });
    renderHome();

    expect(await screen.findByText(/Unknown Artist Piece/)).toBeInTheDocument();
  });

  it('still shows the card when the artwork has no image', async () => {
    renderHome();

    // fakeArtworks have `images: null`, so the <img> has no src
    await screen.findByText(/Water Lilies/);
    expect(screen.getAllByRole('img')[0]).not.toHaveAttribute('src');
  });

  it('still shows the card when the title is missing', async () => {
    mockApi({ data: [{ id: 1, creators: [{ description: 'Monet' }], images: null }] });
    renderHome();

    expect(await screen.findByText(/Monet/)).toBeInTheDocument();
  });

  // KNOWN BUG: Card uses `e.creators[0]`, which crashes the whole page
  // when an artwork has no `creators` field at all.
  // `it.todo` = a test we still have to write. Fix the bug in Card.tsx
  // (use `e.creators?.[0]`), then turn this into a real test.
  it.todo('does not crash when creators is missing completely');
});

// ---------------------------------------------------------------
describe('Home page: API errors', () => {
  const errorMessage = 'Failed to load artworks. Please try again later.';

  it('shows an error when the server answers with an error (500)', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    renderHome();

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('shows an error when there is no internet', async () => {
    // mockRejectedValue = the fetch itself fails
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    renderHome();

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('shows an error when the API sends broken JSON', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    });
    renderHome();

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('does not show "No artworks found." when there is an error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    renderHome();

    await screen.findByText(errorMessage);
    expect(screen.queryByText('No artworks found.')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------
describe('Home page: search', () => {
  it('shows only matching artworks after a search', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    await search('starry');

    expect(await screen.findByText(/The Starry Night/)).toBeInTheDocument();
    expect(screen.queryByText(/Water Lilies/)).not.toBeInTheDocument();
  });

  it('can search by artist name', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    await search('monet');

    expect(await screen.findByText(/Water Lilies/)).toBeInTheDocument();
    expect(screen.queryByText(/The Starry Night/)).not.toBeInTheDocument();
  });

  it('does not care about upper or lower case', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    await search('STARRY');

    expect(await screen.findByText(/The Starry Night/)).toBeInTheDocument();
  });

  it('sends the search text to the API', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    await search('van gogh');

    // spaces are turned into %20 in a URL
    expect(fetch).toHaveBeenLastCalledWith(expect.stringContaining('q=van%20gogh'));
  });

  it('does nothing when the search box is empty', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    await userEvent.click(screen.getByText('Search'));

    // only the first page load called the API
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the search box only has spaces', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    await search('   ');

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('shows "No artworks found." when nothing matches', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    await search('dinosaur');

    expect(await screen.findByText('No artworks found.')).toBeInTheDocument();
  });

  it('shows an error when the search request fails', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    await search('starry');

    expect(
      await screen.findByText('Failed to search artworks. Please try again.')
    ).toBeInTheDocument();
  });

  it('shows an error when a search result has no title (bad data)', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    mockApi({ data: [{ id: 3, creators: [{ description: 'Monet' }], images: null }] });
    await search('monet');

    expect(
      await screen.findByText('Failed to search artworks. Please try again.')
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------
describe('Home page: pages', () => {
  it('disables "previous page" on page 1', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    expect(screen.getByText('previous page')).toBeDisabled();
  });

  it('loads the next 10 artworks when "next page" is clicked', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    await userEvent.click(screen.getByText('next page'));

    expect(fetch).toHaveBeenLastCalledWith(expect.stringContaining('skip=10'));
    expect(screen.getByText('previous page')).toBeEnabled();
  });

  it('goes back to page 1 when "previous page" is clicked', async () => {
    renderHome();
    await screen.findByText(/Water Lilies/);

    await userEvent.click(screen.getByText('next page'));
    await userEvent.click(await screen.findByText('previous page'));

    expect(fetch).toHaveBeenLastCalledWith(expect.stringContaining('skip=0'));
  });
});
