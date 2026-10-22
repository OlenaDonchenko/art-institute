import { Link } from 'react-router';

const Nav = () => {
  return (
    <nav className="flex justify-around">
      <Link to={`/`}>Home</Link>
      <Link to={`/myfav`}>My Fav</Link>
    </nav>
  );
};

export default Nav;
