import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
type Artwork = {
  title: string;
  creators: { description: string }[];
  images: { web: { url: string } } | null;
};

const ArtWork = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [Artwork, setArtwork] = useState<Artwork | undefined>(undefined);

  // fetch one by ID
  const fetchOne = async () => {
    const res = await fetch(
      `https://openaccess-api.clevelandart.org/api/artworks/${id}`
    );
    const data = await res.json();
    setArtwork(data.data);
    console.log(data);
  };

  useEffect(() => {
    fetchOne();
  }, []);

  return (
    <div>
      <figure className="flex flex-col gap-2 w-[25rem] mx-auto">
        <img
          width={200}
          height={200}
          className="aspect-square w-full rounded-lg object-cover"
          src={Artwork?.images?.web.url}
          alt={Artwork?.title}
        />
        <figcaption className="text-sm">
          {Artwork?.title} — {Artwork?.creators[0]?.description}
        </figcaption>
      </figure>
      <button className="btn btn-success" onClick={() => navigate(-1)}>
        go back
      </button>
    </div>
  );
};
export default ArtWork;
