/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  BookOpen,
  Clock,
  Shirt,
  Car,
  Home,
  BookText,
  Award,
  ChevronDown,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function KetentuanUjian() {
  const [openSection, setOpenSection] = useState<string | null>("tujuan");

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections = [
    {
      id: "tujuan",
      title: "Tujuan Pelaksanaan Mapping Test",
      icon: Award,
      content: (
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          Mapping test ini dilaksanakan bertujuan untuk mengukur kemampuan awal
          siswa, yang nantinya akan digunakan sebagai dasar pengelompokan kelas
          pada saat Kegiatan Belajar Mengajar (KBM) dimulai.
        </p>
      ),
    },
    {
      id: "jadwal",
      title: "Jadwal & Waktu Kehadiran",
      icon: Clock,
      content: (
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          Pelaksanaan mapping test dilakukan sesuai dengan jadwal masing-masing
          siswa, dan siswa{" "}
          <strong className="text-brand-green font-semibold">
            wajib hadir di sekolah 10 menit sebelum
          </strong>{" "}
          jadwal ujian berlangsung.
        </p>
      ),
    },
    {
      id: "perlengkapan",
      title: "Perlengkapan Ujian",
      icon: BookOpen,
      content: (
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          Siswa{" "}
          <strong className="text-brand-green font-semibold">
            tidak perlu membawa alat tulis
          </strong>{" "}
          karena mapping test ini bersifat{" "}
          <strong className="text-brand-green font-semibold">
            ujian lisan
          </strong>
          .
        </p>
      ),
    },
    {
      id: "seragam",
      title: "Ketentuan Seragam",
      icon: Shirt,
      content: (
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          Siswa wajib mengenakan seragam sekolah sesuai dengan ketentuan yang
          tercantum dalam surat MPLS (Masa Pengenalan Lingkungan Sekolah).
        </p>
      ),
    },
    {
      id: "materi",
      title: "Materi Ujian",
      icon: BookText,
      content: (
        <div className="space-y-3 text-sm md:text-base">
          <div className="p-3 bg-brand-green-soft rounded-lg border border-brand-green/10">
            <h5 className="font-semibold text-brand-green-dark text-sm flex items-center gap-1.5 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-green"></span>
              Jenjang SD
            </h5>
            <p className="text-gray-600 pl-3.5 text-xs md:text-sm">
              Materi ujian meliputi membaca tulisan bahasa Indonesia, bahasa
              Inggris, serta huruf Hijaiyah/Iqro/Al-Qur'an.
            </p>
          </div>
          <div className="p-3 bg-brand-gold-soft rounded-lg border border-brand-gold/10">
            <h5 className="font-semibold text-brand-gold-dark text-sm flex items-center gap-1.5 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-gold"></span>
              Jenjang SMP & SMA
            </h5>
            <p className="text-gray-600 pl-3.5 text-xs md:text-sm">
              Materi ujian meliputi Al-Qur'an, bahasa Arab (Arabic), dan bahasa
              Inggris (English).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "dropoff",
      title: "Ketentuan Pengantaran",
      icon: Car,
      content: (
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          Dikarenakan keterbatasan area parkir sekolah, wali murid diimbau untuk{" "}
          <strong className="text-brand-green font-semibold">
            hanya melakukan <i>drop-off</i>
          </strong>{" "}
          di sekolah atau dapat memanfaatkan layanan transportasi online.
        </p>
      ),
    },
    {
      id: "kepulangan",
      title: "Ketentuan Kepulangan",
      icon: Home,
      content: (
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          Setelah menyelesaikan seluruh rangkaian mapping test, siswa
          diperkenankan untuk{" "}
          <strong className="text-brand-green font-semibold">
            langsung pulang
          </strong>{" "}
          ke rumah masing-masing.
        </p>
      ),
    },
  ];

  return (
    <div
      id="ketentuan-pelaksanaan"
      className="w-full bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
    >
      {/* Section Header */}
      <div className="bg-gradient-to-r from-brand-green to-brand-green-dark p-5 md:p-6 text-white flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg">
          <Info className="w-6 h-6 text-brand-gold" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg md:text-xl tracking-wide uppercase">
            Ketentuan Pelaksanaan
          </h2>
          <p className="text-xs text-brand-gold-light font-sans font-medium tracking-wide">
            MAPPING TEST SISWA AL-WILDAN ISLAMIC SCHOOL 29 DEPOK
          </p>
          <p className="text-xs text-brand-gold-light font-sans font-medium tracking-wide">
            T.A. 2026/2027
          </p>
        </div>
      </div>

      {/* Accordion List */}
      <div className="p-4 md:p-6 space-y-3">
        {sections.map((sec) => {
          const IconComponent = sec.icon;
          const isOpen = openSection === sec.id;

          return (
            <div
              key={sec.id}
              className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-brand-green bg-brand-green-soft/30 shadow-sm"
                  : "border-gray-100 hover:border-brand-green/30 hover:bg-gray-50/50"
              }`}
            >
              {/* Accordion Trigger */}
              <button
                type="button"
                onClick={() => toggleSection(sec.id)}
                className="w-full px-4 py-4 flex items-center justify-between text-left focus:outline-none transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isOpen
                        ? "bg-brand-green text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span
                    className={`font-display font-semibold text-sm md:text-base transition-colors duration-200 ${
                      isOpen ? "text-brand-green-dark" : "text-gray-800"
                    }`}
                  >
                    {sec.title}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isOpen ? "transform rotate-180 text-brand-green" : ""
                  }`}
                />
              </button>

              {/* Accordion Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-5 pt-1 border-t border-dashed border-gray-100 bg-white/70">
                      {sec.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
