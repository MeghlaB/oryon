import React from "react";
import { motion } from "framer-motion";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-50 to-slate-200">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-lg p-10 text-center bg-white shadow-2xl rounded-3xl"
      >
        <div className="text-red-600 text-[100px] font-extrabold leading-none mb-4 animate-pulse">
          404
        </div>
        <h1 className="mb-2 text-3xl font-semibold md:text-4xl text-slate-800">
          Oops! Page Not Found
        </h1>
        <p className="mb-6 text-gray-500">
          The page you're looking for doesn’t exist or may have been moved.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 text-base font-medium text-white transition bg-red-600 rounded-xl hover:bg-red-700"
        >
          ⬅ Go Back
        </button>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
