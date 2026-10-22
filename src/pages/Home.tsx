import { useState, useEffect } from 'react';
import type { SyntheticEvent } from 'react';

import { type Artwork } from '../types/myTypes';
import Card from '../components/Card';

import { fetchAll } from '../utils/artworkCRUD';

const API_URL = 'https://openaccess-api.clevelandart.org/api/artworks/';

const Home = () => {
  const [pageN, setPageN] = useState(1);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [fav, setFav] = useState<[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleSearch = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${API_URL}?has_image=1&limit=10&q=${encodeURIComponent(searchQuery)}`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await res.json();
      const results: Artwork[] = data.data ?? [];

      const filteredResults = results.filter((artwork) => {
        const query = searchQuery.trim().toLowerCase();

        return (
          artwork.title.toLowerCase().includes(query) ||
          artwork.creators[0]?.description.toLowerCase().includes(query)
        );
      });

      setArtworks(filteredResults);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to search artworks. Please try again.');
      setArtworks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // const controller = new AbortController();
    fetchAll(setIsLoading, setError, API_URL, pageN, setArtworks);
    // return () => controller.abort();
  }, [pageN]);

  if (!artworks) return <p>Loading...</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search artworks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full"
        />

        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
      {isLoading && <p className="text-center mt-6">Searching artworks...</p>}

      {error && <p className="text-center text-error mt-6">{error}</p>}

      {!isLoading && !error && artworks.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No artworks found.</p>
      )}
      {artworks.length > 0 && !isLoading && (
        <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {artworks?.map((e) => (
            <Card key={e.id} e={e} setFav={setFav} fav={fav} />
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          className="btn btn-primary"
          disabled={pageN === 1}
          onClick={() => setPageN((p) => Math.max(1, p - 1))}
          // onClick={() => setPageN(pageN+1)}
        >
          previous page
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setPageN((p) => p + 1)}
        >
          next page
        </button>
      </div>
    </div>
  );
};

export default Home;
