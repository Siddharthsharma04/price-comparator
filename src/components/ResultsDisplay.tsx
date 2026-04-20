"use client";

import React from "react";
import { ComparisonData } from "@/types";
import { ExternalLink, Star, Truck, Tag, Award, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface ResultsDisplayProps {
  data: ComparisonData;
}

export default function ResultsDisplay({ data }: ResultsDisplayProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-6 rounded-3xl"
        >
          <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400">
            <Award size={24} />
            <h3 className="font-bold">Best Deal</h3>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{data.best_deal}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Recommended store</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-6 rounded-3xl"
        >
          <div className="flex items-center gap-3 mb-2 text-green-600 dark:text-green-400">
            <TrendingDown size={24} />
            <h3 className="font-bold">Price Savings</h3>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{data.price_savings}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Max potential savings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 p-6 rounded-3xl md:col-span-1"
        >
          <div className="flex items-center gap-3 mb-2 text-purple-600 dark:text-purple-400">
            <Tag size={24} />
            <h3 className="font-bold">Recommendation</h3>
          </div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
            {data.recommendation}
          </p>
        </motion.div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold px-2">Compare Stores</h2>
        <div className="grid gap-4">
          {data.results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-6"
            >
              <div className="h-20 w-20 flex-shrink-0 bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                {result.thumbnail ? (
                  <img src={result.thumbnail} alt={result.store} className="object-contain w-full h-full p-2" />
                ) : (
                  <Tag className="text-zinc-300" size={32} />
                )}
              </div>

              <div className="flex-grow text-center sm:text-left">
                <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{result.store}</h4>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-1 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    {result.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck size={14} />
                    {result.delivery}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-3 min-w-[120px]">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{result.price}</div>
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                  Visit Store <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
