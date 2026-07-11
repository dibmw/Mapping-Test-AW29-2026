/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SiswaSchedule } from "../types";
import {
  User,
  Hash,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  Bookmark,
  ArrowRight,
  Download,
  CheckCircle,
  Copy,
  Printer,
} from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

interface SiswaCardProps {
  siswa: SiswaSchedule;
}

export default function SiswaCard({ siswa }: SiswaCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    const textToCopy = `
MAPPING TEST SCHEDULE - AL-WILDAN ISLAMIC SCHOOL
----------------------------------------
Nama Siswa     : ${siswa.namaSiswa}
NIS            : ${siswa.nis}
Kelas          : ${siswa.kelas}
Gender         : ${siswa.gender}
Hari / Tanggal : ${siswa.day}
Ruangan        : Ruang ${siswa.ruang}
Waktu Total    : ${siswa.waktuAll}
Waktu Eng/Catung: ${siswa.waktuEngCatung}
Waktu Alq/Arab : ${siswa.waktuAlqArab}
----------------------------------------
Wajib hadir 10 menit sebelum waktu ujian dimulai.
`;
    navigator.clipboard.writeText(textToCopy.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isLaki = siswa.gender.toLowerCase().includes("laki");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full space-y-4 print:p-0"
    >
      {/* Printable Exam Card wrapper */}
      <div
        id="printable-schedule-card"
        className="w-full bg-white rounded-2xl border-2 border-brand-green/20 shadow-xl overflow-hidden print:border-0 print:shadow-none print:bg-white"
      >
        {/* Ribbon Header */}
        <div className="bg-gradient-to-r from-brand-green via-brand-green-light to-brand-green-dark p-4 text-white flex justify-between items-center border-b-4 border-brand-gold">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-display font-bold text-xs tracking-wider uppercase text-brand-gold-light">
                KARTU PESERTA MAPPING TEST
              </h3>
              <p className="text-[10px] opacity-80 font-mono">
                AL-WILDAN ISLAMIC SCHOOL 29 DEPOK
              </p>
              <p className="text-[10px] opacity-80 font-mono">T.A 2026/2027</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] bg-brand-gold/20 text-brand-gold-light font-semibold px-2 py-1 rounded-full border border-brand-gold/30">
              NIS: {siswa.nis || "-"}
            </span>
          </div>
        </div>

        {/* Student Profile Info */}
        <div className="p-6 bg-gradient-to-b from-brand-green-soft/30 to-transparent border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="space-y-1">
              <h4 className="font-display font-extrabold text-lg md:text-xl text-gray-900 tracking-tight leading-tight uppercase">
                {siswa.namaSiswa}
              </h4>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-brand-green/10 text-brand-green px-2.5 py-0.5 rounded-full">
                  <Bookmark className="w-3.5 h-3.5" />
                  Kelas {siswa.kelas}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                    isLaki
                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                      : "bg-pink-50 text-pink-700 border border-pink-100"
                  }`}
                >
                  {siswa.gender}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Schedule Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Day / Date */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-gray-50/50 transition-colors">
              <div className="p-2.5 bg-brand-green/5 text-brand-green rounded-xl shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Hari / Tanggal
                </span>
                <p className="font-display font-bold text-gray-800 text-sm md:text-base">
                  {siswa.day}
                </p>
              </div>
            </div>

            {/* Room */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-gray-50/50 transition-colors">
              <div className="p-2.5 bg-brand-green/5 text-brand-green rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Lokasi / Ruangan
                </span>
                <p className="font-display font-bold text-gray-800 text-sm md:text-base">
                  Ruang {siswa.ruang}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Time Slots */}
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
              <h5 className="font-display font-bold text-xs uppercase text-gray-500 tracking-wider">
                Alokasi Waktu Ujian
              </h5>
            </div>

            <div className="divide-y divide-gray-50">
              {/* Slot 1: Total Time */}
              <div className="p-4 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-brand-green-soft text-brand-green rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-800 block">
                      Waktu Keseluruhan
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Durasi total ujian
                    </span>
                  </div>
                </div>
                <div className="font-mono font-bold text-brand-green bg-brand-green-soft px-3 py-1 rounded-lg text-sm">
                  {siswa.waktuAll}
                </div>
              </div>

              {/* Slot 2: English/Catung */}
              <div className="p-4 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-brand-gold-soft text-brand-gold-dark rounded-lg">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-800 block">
                      Waktu English / Catung
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Jenjang SD (Catung) / SMP-SMA (Eng)
                    </span>
                  </div>
                </div>
                <div className="font-mono font-bold text-brand-gold-dark bg-brand-gold-soft px-3 py-1 rounded-lg text-sm">
                  {siswa.waktuEngCatung}
                </div>
              </div>

              {/* Slot 3: Al-Quran/Arabic */}
              <div className="p-4 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-800 block">
                      Waktu Al-Qur'an / Arab
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Jenjang SD (Hijaiyah) / SMP-SMA (Arab)
                    </span>
                  </div>
                </div>
                <div className="font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg text-sm">
                  {siswa.waktuAlqArab}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice footer */}
          <div className="p-3.5 bg-amber-50/50 border border-amber-200/50 rounded-xl flex gap-2.5 text-xs text-amber-800">
            <span className="font-bold text-base leading-none text-brand-gold">
              ⚠️
            </span>
            <p className="leading-normal">
              Siswa wajib hadir di sekolah paling lambat{" "}
              <strong className="font-bold">10 menit sebelum</strong> jadwal di
              atas dimulai. Tidak perlu membawa alat tulis karena ini merupakan
              ujian lisan.
            </p>
          </div>
        </div>
      </div>

      {/* Card action triggers (Print, Copy, etc.) */}
      <div className="flex gap-2 justify-end print:hidden">
        <button
          type="button"
          onClick={handleCopyText}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">
                Salin Berhasil
              </span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Salin Jadwal</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
