import { useState, useEffect } from 'react';
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

  // fetch all by page and limit
  const fetchAll = async () => {
    const res = await fetch(
      `https://api.artic.edu/api/v1/artworks/?page=${pageN}&limit=10&fields=title,artist_title,image_id,id`
    );
    const data = await res.json();
    setArtworks(data.data);
    console.log(data);
  };

  useEffect(() => {
    fetchAll();
  }, [pageN]);

  if (!artworks) return <p>Loading...</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {artworks?.map((e, index) => {
          return <Card e={e} index={index} />;
        })}
      </div>
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
