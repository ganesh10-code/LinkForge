
import React from "react";
import { motion } from "framer-motion";
const Card = ({ title, desc }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border border-slate-200 bg-white flex flex-col px-6 py-8 gap-3 rounded-lg hover:shadow-sm transition-shadow"
    >
      <h1 className="text-slate-900 text-lg font-semibold">{title}</h1>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
};

export default Card;
