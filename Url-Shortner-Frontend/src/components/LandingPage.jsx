import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStoreContext } from "../contextApi/ContextApi";
import { FaLink, FaChartLine, FaShieldAlt, FaQrcode } from "react-icons/fa";

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white p-8 rounded-2xl border border-borderColor shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="w-12 h-12 bg-bgColor rounded-xl flex items-center justify-center text-accent mb-6">
      <Icon className="text-xl" />
    </div>
    <h3 className="text-xl font-semibold text-textMain mb-3">{title}</h3>
    <p className="text-textSecondary leading-relaxed">{desc}</p>
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useStoreContext();
  const [urlInput, setUrlInput] = useState("");

  const handleShortenSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    if (token) {
      // If logged in, go to dashboard
      navigate("/dashboard");
    } else {
      // If not logged in, redirect to login
      navigate("/login", { state: { message: "Please sign in to create short links." } });
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bgColor flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-borderColor shadow-sm text-sm font-medium text-textSecondary mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Fast • Reliable • Secure
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary tracking-tight mb-6"
          >
            Shorten. Manage. <span className="text-accent">Share.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-textSecondary max-w-2xl mx-auto mb-12"
          >
            Turn long URLs into simple, memorable links. Create, manage, and track your links from one professional URL management platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <form onSubmit={handleShortenSubmit} className="relative flex flex-col sm:flex-row items-center gap-3 p-2 bg-white rounded-2xl shadow-card border border-borderColor">
              <div className="relative flex-1 w-full flex items-center">
                <FaLink className="absolute left-4 text-textSecondary" />
                <input
                  type="url"
                  placeholder="Paste your long URL here..."
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-textMain placeholder-textSecondary focus:outline-none text-lg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-soft whitespace-nowrap text-lg"
              >
                Shorten URL
              </button>
            </form>
            {!token && (
              <p className="mt-4 text-sm text-textSecondary">
                An account is required to manage and track your links. <button type="button" onClick={() => navigate('/register')} className="text-accent hover:underline font-medium">Sign up for free.</button>
              </p>
            )}
          </motion.div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-t border-borderColor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">Everything you need to manage links</h2>
            <p className="text-lg text-textSecondary">
              LinkForge provides professional tools for developers and businesses to take control of their URLs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={FaLink}
              title="Custom Aliases"
              desc="Create memorable, branded links by choosing custom aliases for your shortened URLs instead of random characters."
            />
            <FeatureCard 
              icon={FaChartLine}
              title="Click Analytics"
              desc="Track engagement with an embedded analytics dashboard. Monitor click performance and understand your audience."
            />
            <FeatureCard 
              icon={FaShieldAlt}
              title="Link Expiration"
              desc="Securely share temporary content by setting automatic expiration dates for your short-lived links."
            />
            <FeatureCard 
              icon={FaQrcode}
              title="QR Codes"
              desc="Instantly generate and download scannable QR codes for any short link, perfect for offline marketing."
            />
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Ready to optimize your links?</h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Join professionals using LinkForge to securely shorten, manage, and track their links.
          </p>
          <button 
            onClick={() => navigate(token ? '/dashboard' : '/register')}
            className="px-8 py-4 bg-white text-primary hover:bg-slate-50 font-semibold rounded-xl transition-colors shadow-lg"
          >
            {token ? 'Go to Dashboard' : 'Create Free Account'}
          </button>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
