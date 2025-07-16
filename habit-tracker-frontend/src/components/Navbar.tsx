import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkBase = "px-3 py-1 rounded-xl transition-colors";
  const activeClass = "bg-purple-700 text-white";
  const inactiveClass = "text-gray-300 hover:text-white hover:bg-gray-800";

  return (
    <nav className="flex justify-center sm:justify-start gap-4 py-4 border-b border-gray-800 bg-black">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Daily
      </NavLink>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Dashboard
      </NavLink>
    </nav>
  );
};

export default Navbar;
