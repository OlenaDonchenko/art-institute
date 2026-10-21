import { useState, useEffect} from 'react';
import type { SyntheticEvent } from 'react';
import Card from '../components/Card';

type Artwork = {
  title: string;
  artist_title: string;
  image_id: string;
  id: number;
};

const Home = () => {
  const [pageN, setPageN] = useState(1);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  const [fav, setFav] = useState<Artwork[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  // fetch all by page and limit
  const fetchAll = async () => {
    const res = await fetch(
      `https://api.artic.edu/api/v1/artworks/?page=${pageN}&limit=10&fields=title,artist_title,image_id,id`
    );
    const data = await res.json();
    setArtworks(data.data ?? []);
    console.log(data);
  };


const handleSearch = async (e: SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!searchQuery.trim()) return;

  setIsLoading(true);
  setError('');

  try {
    const res = await fetch(
      `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(searchQuery)}&limit=10&fields=title,artist_title,image_id,id`
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
      artwork.artist_title?.toLowerCase().includes(query)
    );
  });

  setArtworks(filteredResults);
  setPageN(1);
  } catch (error) {
    console.error('Error fetching search results:', error);
    setError('Failed to search artworks. Please try again.');
    setArtworks([]);
  } finally {
    setIsLoading(false);
  }
};

  
  useEffect(() => {
    fetchAll();
  }, [pageN]);

  if (!artworks) return <p>Loading...</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <form
        onSubmit={handleSearch}
        className="mb-6 flex gap-2"
      >
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
      {isLoading && (
        <p className="text-center mt-6">Searching artworks...</p>
      )}

      {error && (
        <p className="text-center text-error mt-6">{error}</p>
      )}

      {!isLoading && !error && artworks.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No artworks found.
        </p>
      )}
      {artworks.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {artworks.map((e, index) => (
            <Card
              key={e.id}
              e={e}
              index={index}
              setFav={setFav}
              fav={fav}
            />
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
  )
};

export default Home;
