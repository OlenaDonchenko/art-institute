import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
type Artwork = {
  title: string;
  artist_title: string;
  image_id: string;
};

const ArtWork = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [Artwork, setArtwork] = useState<Artwork | undefined>(undefined);

  // fetch one by ID
  const fetchOne = async () => {
    const res = await fetch(
      `https://api.artic.edu/api/v1/artworks/${id}?fields=title,artist_title,image_id,id`
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
          src={`/iiif/2/${Artwork?.image_id}/full/843,/0/default.jpg`}
          alt={Artwork?.title}
        />
        <figcaption className="text-sm">
          {Artwork?.title} — {Artwork?.artist_title}
        </figcaption>
      </figure>
      <button className="btn btn-success" onClick={() => navigate(-1)}>
        go back
      </button>
    </div>
  );
};
export default ArtWork;
