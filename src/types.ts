/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SiswaSchedule {
  nis: string;
  namaSiswa: string;
  kelas: string;
  gender: string;
  day: string;
  ruang: string;
  waktuAll: string;
  waktuEngCatung: string;
  waktuAlqArab: string;
}

export interface AnnouncementRule {
  title: string;
  items: string[];
}
