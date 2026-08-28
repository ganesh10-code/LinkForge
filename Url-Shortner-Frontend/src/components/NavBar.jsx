import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useStoreContext } from "../contextApi/ContextApi";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useStoreContext();
  const path = useLocation().pathname;
  const [navbarOpen, setNavbarOpen] = useState(false);

  const onLogOutHandler = () => {
    setToken(null);
    localStorage.removeItem("JWT_TOKEN");
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50">
      {/* --- Top Navbar Row --- */}
      <div className="h-16 bg-custom-gradient-navbar flex items-center">
        <div className="lg:px-14 sm:px-8 px-4 w-full flex justify-between">
          {/* Logo */}
          <Link to="/">
            <h1 className="font-bold text-3xl text-black italic sm:mt-0 mt-2">
              Shortify
            </h1>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden sm:flex gap-10 items-center text-slate-800">
            <li>
              <Link
                className={`${
                  path === "/" ? "text-black font-semibold" : "text-gray-600"
                }`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className={`${
                  path === "/about" ? "text-black font-semibold" : "text-gray-600"
                }`}
                to="/about"
              >
                About
              </Link>
            </li>
            {token && (
              <li>
                <Link
                  className={`${
                    path === "/dashboard"
                      ? "text-black font-semibold"
                      : "text-gray-600"
                  }`}
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
            )}
            {!token && (
              <Link to="/register">
                <li className="bg-custom-gradient text-white cursor-pointer w-24 text-center font-semibold px-2 py-2 rounded-md hover:text-slate-300 transition-all duration-150">
                  Sign Up
                </li>
              </Link>
            )}
            {token && (
              <button
                onClick={onLogOutHandler}
                className="bg-rose-700 text-white cursor-pointer w-24 text-center font-semibold px-2 py-2 rounded-md hover:text-slate-300 transition-all duration-150"
              >
                Log Out
              </button>
            )}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="sm:hidden flex items-center"
          >
            {navbarOpen ? (
              <RxCross2 className="text-black text-3xl" />
            ) : (
              <IoIosMenu className="text-black text-3xl" />
            )}
          </button>
        </div>
      </div>

      {/* --- Mobile Dropdown --- */}
      <div
        className={`sm:hidden transition-all duration-300 overflow-hidden ${
          navbarOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-4 px-4 py-4 bg-custom-gradient shadow-md">
          <li>
            <Link
              className={`${
                path === "/" ? "text-white font-semibold" : "text-gray-300"
              }`}
              to="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className={`${
                path === "/about" ? "text-white font-semibold" : "text-gray-300"
              }`}
              to="/about"
            >
              About
            </Link>
          </li>
          {token && (
            <li>
              <Link
                className={`${
                  path === "/dashboard"
                    ? "text-white font-semibold"
                    : "text-gray-300"
                }`}
                to="/dashboard"
              >
                Dashboard
              </Link>
            </li>
          )}
          {!token && (
            <Link to="/register">
              <li className="bg-custom-gradient text-white cursor-pointer w-24 text-center font-semibold px-2 py-2 rounded-md hover:text-slate-300 transition-all duration-150">
                Sign Up
              </li>
            </Link>
          )}
          {token && (
            <button
              onClick={onLogOutHandler}
              className="bg-rose-700 text-white cursor-pointer w-24 text-center font-semibold px-2 py-2 rounded-md hover:text-slate-300 transition-all duration-150"
            >
              Log Out
            </button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
