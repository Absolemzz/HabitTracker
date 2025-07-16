import { NavLink } from 'react-router-dom';

const Header = () => {
  const linkBase = "px-3 py-1 rounded-xl transition-colors text-sm sm:text-base";
  const activeClass = "bg-purple-700 text-white";
  const inactiveClass = "text-gray-300 hover:text-white hover:bg-gray-800";

  return (
    <header className="w-full bg-black/90 py-4 px-4 sm:px-8 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 text-transparent bg-clip-text text-center">
          Daily Habits
        </h1>
        <nav className="flex gap-3">
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
      </div>
    </header>
  );
};

export default Header;

