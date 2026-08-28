import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-custom-gradient-footer text-white py-8 z-40 relative">
      <div className="container mx-auto px-6 lg:px-14 flex flex-col lg:flex-row lg:justify-between items-center gap-4">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold mb-2">Shortify</h2>
          <p>Simplifying URL shortening for efficient sharing</p>
          <p className="text-sm">&copy; 2025 Shortify. All rights reserved.</p>
        </div>

        <div className="flex space-x-6 mt-4 lg:mt-0">
          {/* <a href="#" className="hover:text-gray-200">
            <FaFacebook size={24} />
          </a>
          <a href="#" className="hover:text-gray-200">
            <FaTwitter size={24} />
          </a> */}
          <a
            href="https://github.com/Abhishek-2502"
            className="hover:text-gray-200"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/abhishek--rajput"
            className="hover:text-gray-200"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
