/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from "react";
import { SiswaSchedule } from "../types";
import { Search, X, UserCheck, HelpCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SiswaSearchProps {
  schedules: SiswaSchedule[];
  onSelectSiswa: (siswa: SiswaSchedule | null) => void;
  selectedSiswa: SiswaSchedule | null;
}

export default function SiswaSearch({ schedules, onSelectSiswa, selectedSiswa }: SiswaSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SiswaSchedule[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if selectedSiswa is cleared from parent or updated
  useEffect(() => {
    if (selectedSiswa) {
      setQuery(selectedSiswa.namaSiswa);
    } else {
      setQuery("");
      setHasSearched(false);
    }
  }, [selectedSiswa]);

  // Handle outside click to hide suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update suggestions on query change
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || (selectedSiswa && query === selectedSiswa.namaSiswa)) {
      setSuggestions([]);
      return;
    }

    // Search by name only
    const filtered = schedules.filter(
      (s) =>
        s.namaSiswa.toLowerCase().includes(trimmed)
    );

    // Limit to 8 suggestions for performance and UI layout density
    setSuggestions(filtered.slice(0, 8));
  }, [query, schedules, selectedSiswa]);

  const handleInputChange = (val: string) => {
    setQuery(val);
    setShowSuggestions(true);
    if (val === "") {
      onSelectSiswa(null);
      setHasSearched(false);
    }
  };

  const handleSelect = (siswa: SiswaSchedule) => {
    setQuery(siswa.namaSiswa);
    onSelectSiswa(siswa);
    setShowSuggestions(false);
    setHasSearched(true);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;

    // Find first matching student by name only
    const match = schedules.find(
      (s) =>
        s.namaSiswa.toLowerCase() === trimmed ||
        s.namaSiswa.toLowerCase().includes(trimmed)
    );

    if (match) {
      handleSelect(match);
    } else {
      onSelectSiswa(null);
      setHasSearched(true);
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSelectSiswa(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setHasSearched(false);
  };

  return (
    <div className="w-full space-y-4" ref={containerRef}>
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        {/* Search input field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5 text-brand-green/70" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Cari Nama Siswa..."
            className="w-full pl-11 pr-12 py-3.5 md:py-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm text-sm md:text-base focus:border-brand-green focus:outline-none focus:ring-4 focus:ring-brand-green/5 text-gray-800 placeholder-gray-400 font-sans transition-all"
          />

          {/* Right action button (clear search vs search enter indicator) */}
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1 active:scale-95"
            >
              Cari
            </button>
          </div>
        </div>

        {/* Autocomplete Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-30 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-64 overflow-y-auto divide-y divide-gray-50 focus:outline-none scrollbar-thin"
            >
              {suggestions.map((item) => (
                <button
                  key={item.nis}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-4 py-3 text-left hover:bg-brand-green-soft/50 flex items-center justify-between transition-colors group"
                >
                  <div className="flex flex-col pr-4">
                    <span className="font-display font-semibold text-sm text-gray-800 group-hover:text-brand-green transition-colors uppercase">
                      {item.namaSiswa}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs bg-brand-green/10 text-brand-green font-semibold px-2 py-0.5 rounded-full">
                      Kelas {item.kelas}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-green group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* No matching results warning (Penanganan Error) */}
      <AnimatePresence>
        {hasSearched && !selectedSiswa && query.trim() !== "" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3"
          >
            <div className="p-2 bg-red-100 text-red-600 rounded-xl shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-red-800">
                Data Tidak Ditemukan
              </h4>
              <p className="text-xs text-red-600 leading-relaxed">
                Maaf, jadwal untuk nama siswa <span className="font-semibold">"{query}"</span> tidak ditemukan. 
                Pastikan ejaan nama yang Anda masukkan sudah benar, atau cari menggunakan beberapa huruf dari nama siswa.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
