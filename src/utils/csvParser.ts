/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SiswaSchedule } from "../types";

/**
 * Parses Google Sheets exported CSV text into SiswaSchedule objects.
 * Handles quoted fields (e.g. date strings containing commas) and cleans outer quotes.
 */
export function parseCSVToSchedules(csvText: string): SiswaSchedule[] {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  const list: SiswaSchedule[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cells: string[] = [];
    let currentCell = "";
    let inQuotes = false;

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cells.push(currentCell.trim());
        currentCell = "";
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell.trim());

    if (cells.length >= 9) {
      const cleanCell = (val: string) => val.replace(/^["']|["']$/g, '').trim();

      const nis = cleanCell(cells[0]);
      const namaSiswa = cleanCell(cells[1]);
      const kelas = cleanCell(cells[2]);
      const gender = cleanCell(cells[3]);
      const day = cleanCell(cells[4]);
      const ruang = cleanCell(cells[5]);
      const waktuAll = cleanCell(cells[6]);
      const waktuEngCatung = cleanCell(cells[7]);
      const waktuAlqArab = cleanCell(cells[8]);

      // Exclude rows that are just headers or side-table headers (e.g. if the row says "NIS" or "nama siswa")
      if (nis.toLowerCase() === "nis" || namaSiswa.toLowerCase() === "nama siswa") {
        continue;
      }

      if (nis || namaSiswa) {
        list.push({
          nis,
          namaSiswa,
          kelas,
          gender,
          day,
          ruang,
          waktuAll,
          waktuEngCatung,
          waktuAlqArab
        });
      }
    }
  }

  return list;
}
