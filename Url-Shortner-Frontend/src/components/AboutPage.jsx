import React from "react";
import { FaLink, FaShareAlt, FaEdit, FaChartLine } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="lg:px-14 sm:px-8 px-5 min-h-[calc(100vh-64px)] flex justify-center items-center pt-2">
      <div className="bg-white w-full sm:py-10 py-8 max-w-5xl text-center">
        <h1 className="sm:text-4xl text-slate-800 text-3xl font-bold italic mb-5">
          About Shortify
        </h1>
        <p className="text-gray-700 text-sm mb-8 xl:w-[70%] lg:w-[75%] sm:w-[80%] w-full mx-auto">
          Shortify is a modern URL shortening platform that helps you create
          clean, memorable, and easy-to-share links in seconds. With powerful
          analytics, you can track clicks, user engagement, and traffic sources
          to better understand your audience. Designed for speed, reliability,
          and security, Shortify ensures your links are always accessible and
          protected. Whether you’re an individual or a business, Shortify makes
          link management simple and effective.
        </p>

        <div className="space-y-5 xl:w-[70%] lg:w-[75%] sm:w-[80%] w-full mx-auto text-left mb-10">
          <div className="flex items-start">
            <FaLink className="text-blue-500 text-3xl mr-4" />
            <div>
              <h2 className="sm:text-2xl font-bold text-slate-800 mb-2">
                Simple URL Shortening
              </h2>
              <p className="text-gray-600 text-sm">
                Experience the ease of creating short, memorable URLs in just a
                few clicks. Our intuitive interface and quick setup process
                ensure you can start shortening URLs without any hassle.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <FaShareAlt className="text-green-500 text-3xl mr-4" />
            <div>
              <h2 className="sm:text-2xl font-bold text-slate-800 mb-2">
                Powerful Analytics
              </h2>
              <p className="text-gray-600 text-sm">
                Gain insights into your link performance with our comprehensive
                analytics dashboard. Track clicks, geographical data, and
                referral sources to optimize your marketing strategies.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <FaEdit className="text-purple-500 text-3xl mr-4" />
            <div>
              <h2 className="sm:text-2xl font-bold text-slate-800 mb-2">
                Enhanced Security
              </h2>
              <p className="text-gray-600 text-sm ">
                Rest assured with our robust security measures. All shortened
                URLs are protected with advanced encryption, ensuring your data
                remains safe and secure.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <FaChartLine className="text-red-500 text-3xl mr-4" />
            <div>
              <h2 className="sm:text-2xl font-bold text-slate-800 mb-2">
                Fast and Reliable
              </h2>
              <p className="text-gray-600 text-sm ">
                Enjoy lightning-fast redirects and high uptime with our reliable
                infrastructure. Your shortened URLs will always be available and
                responsive, ensuring a seamless experience for your users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
