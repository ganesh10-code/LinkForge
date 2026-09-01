import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useStoreContext } from "../contextApi/ContextApi";
import { FaLink } from "react-icons/fa6";

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

  const navLinkStyle = (isActive) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-accent" : "text-textSecondary hover:text-textMain"
    }`;

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-borderColor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <FaLink className="text-sm" />
            </div>
            <span className="font-bold text-xl text-primary tracking-tight">
              LinkForge
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden sm:flex items-center gap-8">
            <Link className={navLinkStyle(path === "/")} to="/">
              Home
            </Link>
            <Link className={navLinkStyle(path === "/about")} to="/about">
              About
            </Link>
            
            {token ? (
              <>
                <Link className={navLinkStyle(path === "/dashboard")} to="/dashboard">
                  Dashboard
                </Link>
                <div className="h-4 w-px bg-slate-200"></div>
                <button
                  onClick={onLogOutHandler}
                  className="text-sm font-medium text-textSecondary hover:text-textMain transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4 ml-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-textSecondary hover:text-textMain transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register">
                  <button className="bg-primary text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-soft">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="sm:hidden p-2 rounded-md text-textSecondary hover:bg-slate-100 transition-colors"
          >
            {navbarOpen ? (
              <RxCross2 className="text-2xl" />
            ) : (
              <IoIosMenu className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* --- Mobile Dropdown --- */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          navbarOpen ? "max-h-64 border-b border-borderColor bg-white" : "max-h-0"
        }`}
      >
        <ul className="px-4 py-4 space-y-4">
          <li>
            <Link
              onClick={() => setNavbarOpen(false)}
              className={`block w-full ${navLinkStyle(path === "/")}`}
              to="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setNavbarOpen(false)}
              className={`block w-full ${navLinkStyle(path === "/about")}`}
              to="/about"
            >
              About
            </Link>
          </li>
          {token ? (
            <>
              <li>
                <Link
                  onClick={() => setNavbarOpen(false)}
                  className={`block w-full ${navLinkStyle(path === "/dashboard")}`}
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setNavbarOpen(false);
                    onLogOutHandler();
                  }}
                  className="block w-full text-left text-sm font-medium text-textSecondary hover:text-textMain"
                >
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <li className="pt-2 flex flex-col gap-3 border-t border-slate-100">
              <Link
                onClick={() => setNavbarOpen(false)}
                to="/login"
                className="text-center text-sm font-medium text-textSecondary hover:text-textMain transition-colors py-2"
              >
                Sign In
              </Link>
              <Link onClick={() => setNavbarOpen(false)} to="/register">
                <button className="w-full bg-primary text-white text-sm px-4 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                  Sign Up
                </button>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

