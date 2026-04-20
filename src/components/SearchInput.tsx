"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Search, Image as ImageIcon, X, Loader2 } from "lucide-react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  onImageSearch: (image: string) => void;
  isLoading: boolean;
}

export default function SearchInput({ onSearch, onImageSearch, isLoading }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Expose focus method globally for "Get Started" button
  React.useEffect(() => {
    (window as any).focusSearch = () => inputRef.current?.focus();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Check if file size is > 4MB (common limit for API routes)
      if (file.size > 4 * 1024 * 1024) {
        alert("The image is too large. Please upload an image smaller than 4MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageSearch(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSearch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    noClick: true, // We'll trigger it with a separate button
  });

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const clearImage = () => {
    setPreview(null);
    setQuery("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleTextSearch} className="relative group">
        <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <div className="pl-4 text-zinc-400">
            <Search size={20} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for any product (e.g. 'Sony WH-1000XM5')"
            className="w-full px-4 py-4 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
            disabled={isLoading}
          />
          <div className="flex items-center gap-2 pr-2">
            <label className="p-2 text-zinc-500 hover:text-blue-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors">
              <input {...getInputProps()} className="hidden" />
              <ImageIcon size={20} />
            </label>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Search"}
            </button>
          </div>
        </div>
      </form>

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
        } ${preview ? "hidden" : "block"}`}
      >
        <div className="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full">
            <ImageIcon size={32} />
          </div>
          <p className="text-sm font-medium">Drag and drop an image of the product</p>
          <p className="text-xs">or click the image icon in the search bar</p>
        </div>
      </div>

      {preview && (
        <div className="relative inline-block mt-4">
          <img
            src={preview}
            alt="Search preview"
            className="h-32 w-auto rounded-xl border border-zinc-200 dark:border-zinc-800 object-cover"
          />
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
          >
            <X size={14} />
          </button>
          <p className="text-xs text-zinc-500 mt-2">Analyzing image to find product details...</p>
        </div>
      )}
    </div>
  );
}
