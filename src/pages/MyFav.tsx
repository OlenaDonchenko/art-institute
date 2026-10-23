import { type ChangeEventHandler, useState } from 'react';
import { type Artwork } from '../types/myTypes';
const MyFav = () => {
  // fetch from local
  // store in  state
  // map through the data
  const local = localStorage.getItem('fav');

  const [localFav, setlocalFav] = useState((local && JSON.parse(local)) || []);
  const [showTextArea, setShowTextArea] = useState(false);
  const [id, setId] = useState(0);

  const [userInput, setUserInput] = useState('');

  const handleAddNote = (id: number) => {
    setShowTextArea(!showTextArea);
    setId(id);
    console.log(id);
  };

  const handleCHange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    console.log(e.target.value);
    setUserInput(e.target.value);
  };

  const handleSubmitNote = () => {
    setShowTextArea(!showTextArea);

    localFav.forEach((e: any) => {
      if (e.id === id) {
        e.myNote = userInput;
      }
    });

    localStorage.setItem('fav', JSON.stringify(localFav));
  };

  const handleRemove = (id: number) => {
    const updatedFav = localFav.filter((artwork: Artwork) => artwork.id !== id);
    setlocalFav(updatedFav);
    localStorage.setItem('fav', JSON.stringify(updatedFav));
  };

  return (
    <div>
      {showTextArea && (
        <div className="w-full ">
          <button onClick={handleSubmitNote} className="btn-success">
            Submit
          </button>
          <textarea
            rows={5}
            cols={50}
            className="bg-blue-100 text-black"
            onChange={handleCHange}
          ></textarea>
        </div>
      )}
      <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-4 py-6">
        {localFav?.map((e: Artwork, index: number) => {
          return (
            <div key={index}>
              <figure className="flex flex-col gap-2 py-3">
                <img
                  className="aspect-square w-full rounded-lg object-cover"
                  src={e.images?.web.url}
                  alt={e.title}
                />
                <figcaption className="text-sm">
                  {e.title} — {e.creators[0]?.description}
                </figcaption>
              </figure>
              <button
                onClick={() => handleAddNote(e.id)}
                className="btn btn-info"
              >
                add note
              </button>
              <button className="btn btn-error ml-2" onClick={() => handleRemove(e.id)}>
                remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MyFav;
