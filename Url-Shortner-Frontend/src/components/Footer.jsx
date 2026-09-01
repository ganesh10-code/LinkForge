import React from "react";


const Footer = () => {
  return (
    <footer className="bg-white border-t border-borderColor py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-bold text-xl text-primary tracking-tight mb-2">
              LinkForge
            </span>
            <p className="text-sm text-textSecondary text-center md:text-left">
              Turn long URLs into simple, memorable links.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-textSecondary text-center">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-textSecondary">
            <a href="#" className="hover:text-textMain transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-textMain transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
