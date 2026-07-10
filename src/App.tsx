/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { SiswaSchedule } from "./types";
import { parseCSVToSchedules } from "./utils/csvParser";
import SiswaSearch from "./components/SiswaSearch";
import SiswaCard from "./components/SiswaCard";
import KetentuanUjian from "./components/KetentuanUjian";
import {
  CalendarRange,
  MapPin,
  Users,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Search,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [schedules, setSchedules] = useState<SiswaSchedule[]>([]);
  const [selectedSiswa, setSelectedSiswa] = useState<SiswaSchedule | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchedNis, setLastSearchedNis] = useState<string | null>(null);

  // Stats from the database
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalRuang: 0,
    totalHari: 0,
  });

  // Fetch student schedules from Google Sheets CSV Export
  useEffect(() => {
    async function fetchData() {
      const csvUrl =
        "https://docs.google.com/spreadsheets/d/1m7n1Lf6oEO7xyRayp6J9aleY-3E60upiqOshM0mNKsw/export?format=csv&gid=1757285573";
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(csvUrl);
        if (!response.ok) {
          throw new Error(`Gagal memuat database (Status: ${response.status})`);
        }

        const csvText = await response.text();
        const parsedData = parseCSVToSchedules(csvText);

        if (parsedData.length === 0) {
          throw new Error("Format database tidak sesuai atau data kosong.");
        }

        setSchedules(parsedData);

        // Calculate some stats to show
        const uniqueRuang = new Set(
          parsedData.map((s) => s.ruang).filter(Boolean),
        );
        const uniqueHari = new Set(
          parsedData.map((s) => s.day).filter(Boolean),
        );
        setStats({
          totalSiswa: parsedData.length,
          totalRuang: uniqueRuang.size,
          totalHari: uniqueHari.size,
        });

        // Load saved selection from localStorage if any
        const savedNis = localStorage.getItem("alwildan_mapping_saved_nis");
        if (savedNis) {
          const found = parsedData.find((s) => s.nis === savedNis);
          if (found) {
            setSelectedSiswa(found);
            setLastSearchedNis(savedNis);
          }
        }
      } catch (err: any) {
        console.error("Fetch database error:", err);
        setError(
          err.message ||
            "Koneksi internet bermasalah atau spreadsheet tidak dapat diakses.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSelectSiswa = (siswa: SiswaSchedule | null) => {
    setSelectedSiswa(siswa);
    if (siswa) {
      localStorage.setItem("alwildan_mapping_saved_nis", siswa.nis);
      setLastSearchedNis(siswa.nis);
    } else {
      localStorage.removeItem("alwildan_mapping_saved_nis");
      setLastSearchedNis(null);
    }
  };

  const handleRemoveSaved = () => {
    handleSelectSiswa(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 font-sans flex flex-col antialiased selection:bg-brand-green/10 selection:text-brand-green">
      {/* HEADER SECTION WITH BRAND COLORS */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20 print:hidden">
        <div className="max-w-2xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://www.image2url.com/r2/default/files/1783295328513-c1e80ddc-496a-41bc-af8b-fb84383aea19.png"
              alt="Logo Al-Wildan Islamic School"
              referrerPolicy="no-referrer"
              className="h-12 w-auto object-contain"
            />
            <div className="border-l border-gray-200 pl-3 py-0.5">
              <h1 className="font-display font-black text-brand-green text-sm md:text-base tracking-wide uppercase leading-tight">
                MAPPING TEST
              </h1>
              <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wider uppercase leading-none mt-0.5">
                AL-WILDAN ISLAMIC SCHOOL 29 DEPOK
              </p>
              <p className="text-[9px] md:text-[10px] text-gray-400 font-semibold tracking-wider uppercase leading-none mt-1">
                T.A. 2026/2027
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50/80 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline">Database Terhubung</span>
              <span className="sm:hidden">Aktif</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 md:py-10 space-y-8 print:p-0 print:max-w-full">
        {/* HERO SECTION / INTRO */}
        <section className="text-center space-y-3.5 print:hidden">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight leading-tight">
            Cek Jadwal{" "}
            <span className="text-brand-green underline decoration-brand-gold decoration-4 underline-offset-4">
              Mapping Test
            </span>{" "}
            Siswa
          </h2>
          <p className="text-xs md:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Gunakan kolom di bawah untuk mencari jadwal ujian ananda dengan
            mudah dan cepat.
          </p>
        </section>

        {/* DATABASE STATUS LOADING / ERROR */}
        <section className="print:hidden">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-brand-green/10 border-t-brand-green animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-brand-green font-bold">
                    AL
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-gray-800 text-sm md:text-base">
                    Menghubungkan ke Google Sheets...
                  </h4>
                  <p className="text-xs text-gray-400">
                    Sinkronisasi database jadwal real-time sedang berlangsung
                  </p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-50 border border-red-200 p-6 rounded-2xl space-y-4 text-center"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-red-800 text-sm md:text-base">
                    Gagal Sinkronisasi
                  </h4>
                  <p className="text-xs text-red-600 max-w-sm mx-auto leading-relaxed">
                    {error}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Coba Muat Ulang Halaman
                </button>
              </motion.div>
            )}

            {/* MAIN APP WORKFLOW (SHOW ONLY WHEN LOADED) */}
            {!isLoading && !error && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Search Panel Card */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <Search className="w-3.5 h-3.5 text-brand-green" />
                      PENCARIAN JADWAL
                    </span>
                    <span className="text-[10px] bg-brand-green/10 text-brand-green font-medium px-2 py-0.5 rounded-full">
                      {stats.totalSiswa} Siswa Terdaftar
                    </span>
                  </div>

                  <SiswaSearch
                    schedules={schedules}
                    onSelectSiswa={handleSelectSiswa}
                    selectedSiswa={selectedSiswa}
                  />

                  {/* Suggestion hints */}
                  {!selectedSiswa && (
                    <div className="pt-2 text-xs text-gray-400 flex flex-wrap items-center gap-1.5">
                      <span className="font-medium text-gray-500">
                        Contoh pencarian:
                      </span>
                      <span className="font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-lg">
                        Abdullah
                      </span>
                      <span className="text-gray-400">atau</span>
                      <span className="font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-lg">
                        Jasmine
                      </span>
                    </div>
                  )}
                </div>

                {/* Selected Student Details Card */}
                <AnimatePresence mode="wait">
                  {selectedSiswa && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1 print:hidden">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          HASIL PENCARIAN JADWAL
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveSaved}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold"
                        >
                          Hapus Pilihan
                        </button>
                      </div>
                      <SiswaCard siswa={selectedSiswa} />
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* KETENTUAN PELAKSANAAN SECTION */}
        <section className="print:hidden">
          <KetentuanUjian />
        </section>

        {/* HELPER BOX FOR QUICK CONTACT */}
        <section className="bg-brand-gold-soft border border-brand-gold/10 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between print:hidden">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-brand-gold-dark text-sm md:text-base flex items-center gap-1.5">
              Butuh Bantuan Lain?
            </h4>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Jika Abu/Ummu membutuhkan informasi lebih lanjut, Insya Allah
              dapat menghubungi wali kelas ananda.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-brand-green-dark text-white py-6 mt-auto print:hidden">
        <div className="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-brand-green-soft/60 gap-3 font-sans">
          <p>© 2026 AL-WILDAN ISLAMIC SCHOOL 29 DEPOK. Hak Cipta Dilindungi.</p>
          <div className="flex gap-4">
            <a
              href="#ketentuan-pelaksanaan"
              className="hover:text-brand-gold text-brand-green-soft/80 transition-colors font-medium"
            >
              Ketentuan Pelaksanaan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
