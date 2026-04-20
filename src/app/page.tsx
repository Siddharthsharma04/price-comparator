"use client";

import { useState } from "react";
import SearchInput from "@/components/SearchInput";
import ResultsDisplay from "@/components/ResultsDisplay";
import { ComparisonData } from "@/types";
import { Sparkles, ShoppingBag, Zap, ShieldCheck, Search } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ComparisonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("Failed to fetch comparison data");

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSearch = async (image: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // Step 1: Analyze image to get a query
      const analysisResponse = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      if (!analysisResponse.ok) throw new Error("Failed to analyze image");

      const { query } = await analysisResponse.json();

      // Step 2: Search with the extracted query
      await handleSearch(query);
    } catch (err) {
      console.error(err);
      setError("Failed to process the image. Please try a text search.");
      setIsLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePopularDeal = (query: string) => {
    handleSearch(query);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 scroll-smooth">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="font-black text-xl tracking-tight">PriceAI</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-zinc-500">
            <button onClick={() => scrollToSection("how-it-works")} className="hover:text-blue-600 transition-colors">How it works</button>
            <button onClick={() => scrollToSection("popular-deals")} className="hover:text-blue-600 transition-colors">Popular Deals</button>
            <button 
              onClick={() => (window as any).focusSearch?.()}
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> AI-Powered Price Comparison
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            Find the best deals <br />
            <span className="text-blue-600">in seconds.</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            Upload an image or type a product name. Our AI engine scans thousands of stores to find you the lowest prices and best ratings.
          </p>

          <div className="pt-8">
            <SearchInput
              onSearch={handleSearch}
              onImageSearch={handleImageSearch}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 pb-20">
        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl text-center">
            {error}
          </div>
        )}

        {isLoading && !data && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50 pointer-events-none">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        )}

        {data && <ResultsDisplay data={data} />}
      </section>

      {/* Popular Deals Section */}
      <section id="popular-deals" className="py-20 bg-white dark:bg-zinc-900 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-8">Popular Searches</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "iPhone 15 Pro", category: "Phones" },
              { name: "Sony WH-1000XM5", category: "Audio" },
              { name: "MacBook Air M3", category: "Laptops" },
              { name: "PlayStation 5 Slim", category: "Gaming" },
              { name: "Nike Air Max 270", category: "Shoes" },
              { name: "Samsung S24 Ultra", category: "Phones" },
              { name: "Kindle Paperwhite", category: "E-readers" },
              { name: "Dyson V15 Detect", category: "Home" }
            ].map((deal) => (
              <button
                key={deal.name}
                onClick={() => handlePopularDeal(deal.name)}
                className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl text-left hover:ring-2 hover:ring-blue-500 transition-all group"
              >
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">{deal.category}</p>
                <p className="font-bold text-lg group-hover:text-blue-600 transition-colors">{deal.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">How It Works</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Simple steps to saving money on every purchase.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Upload or Search",
                desc: "Type a product name or upload an image. Our AI identifies exactly what you're looking for.",
                icon: <Search className="text-blue-600" size={32} />
              },
              {
                step: "02",
                title: "AI Analysis",
                desc: "We scan major retailers like Amazon, Walmart, and eBay in real-time to find current prices.",
                icon: <Zap className="text-blue-600" size={32} />
              },
              {
                step: "03",
                title: "Get Best Deals",
                desc: "Compare prices, shipping, and ratings instantly to make the best purchasing decision.",
                icon: <ShoppingBag className="text-blue-600" size={32} />
              }
            ].map((item) => (
              <div key={item.step} className="relative p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                  {item.step}
                </div>
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Zap size={18} />
            <span className="font-bold tracking-tight uppercase text-sm">PriceAI Engine</span>
          </div>
          <p className="text-sm text-zinc-500">
            © 2026 PriceAI. All rights reserved. Powered by Gemini & SerpApi.
          </p>
        </div>
      </footer>
    </main>
  );
}
