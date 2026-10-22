import { Link } from 'react-router';

type CardParams = {
  e: {
    id: number;
    title: string;
    creators: { description: string }[];
    images: { web: { url: string } } | null;
  };
  setFav: Function;
  fav: [];
};

const Card = ({ e, setFav, fav }: CardParams) => {
  const addToFav = () => {
    const local = localStorage.getItem('fav');
    const localFav = (local && JSON.parse(local)) || [];
    localStorage.setItem('fav', JSON.stringify([...localFav, e]));
  };

  return (
    <figure className="flex flex-col gap-2">
      <img
        className="aspect-square w-full rounded-lg object-cover"
        src={e.images?.web.url}
        alt={e.title}
      />
      <figcaption className="text-sm">
        {e.title} — {e.creators[0]?.description}
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
