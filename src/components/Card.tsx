import { Link } from 'react-router';

type CardParams = {
  e: { image_id: string; title: string; artist_title: string; id: number };
  index: number;
  setFav: Function;
  fav: [];
};

const Card = ({ e, index, setFav, fav }: CardParams) => {
  const addToFav = () => {
    // const local = localStorage.getItem('fav');
    // const loacalFav = (local && JSON.parse(local)) || [];
    localStorage.setItem('fav', JSON.stringify([e]));
  };

  return (
    <figure key={index} className="flex flex-col gap-2">
      <img
        className="aspect-square w-full rounded-lg object-cover"
        src={`/iiif/2/${e.image_id}/full/843,/0/default.jpg`}
        alt={e.title}
      />
      <figcaption className="text-sm">
        {e.title} — {e.artist_title}
      </figcaption>
      <Link to={`/artwork/${e.id}`} className="btn text-[#6262b2]">
        see more
      </Link>
      <button
        className="btn btn-success w-[30%] text-[.6rem]"
        onClick={addToFav}
      >
        Add to fav
      </button>
    </figure>
  );
};

export default Card;
