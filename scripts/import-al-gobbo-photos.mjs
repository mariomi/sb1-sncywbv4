import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const sourceRoot = process.argv[2];
if (!sourceRoot) {
  throw new Error('Pass the Al gobbo source folder as the first argument.');
}

const outputRoot = path.resolve('src/Img/al-gobbo-2026');
const publicHeroRoot = path.resolve('public/images/hero');

const photos = [
  { source: '01-locale-interni/al-gobbo-di-rialto-interno-013.jpg', name: 'interior-hero', widths: [480, 900, 1200, 1600] },
  { source: '02-esterno-ingresso/al-gobbo-di-rialto-esterno-007.jpg', name: 'entrance-portrait', widths: [480, 900, 1200] },
  { source: '04-tavoli-e-mise-en-place/al-gobbo-di-rialto-tavolo-003.jpg', name: 'table-portrait', widths: [480, 900, 1200] },
  { source: '03-bar-e-cantina/al-gobbo-di-rialto-bar-cantina-011.jpg', name: 'bar-portrait', widths: [480, 900, 1200] },
  { source: '06-burrata-e-pomodorini/al-gobbo-di-rialto-burrata-pomodorini-009.jpg', name: 'burrata-portrait', widths: [480, 900, 1200] },
  { source: '05-staff/al-gobbo-di-rialto-staff-003.jpg', name: 'staff-wide', widths: [480, 900, 1600] },
  { source: '02-esterno-ingresso/al-gobbo-di-rialto-esterno-001.jpg', name: 'exterior-wide', widths: [1600] },
  { source: '06-burrata-e-pomodorini/al-gobbo-di-rialto-burrata-pomodorini-012.jpg', name: 'burrata-wide', widths: [1600] },
  { source: '07-pasta/al-gobbo-di-rialto-pasta-013.jpg', name: 'pasta-wide', widths: [1600] },
  { source: '08-risotto/al-gobbo-di-rialto-risotto-003.jpg', name: 'risotto-wide', widths: [1600] },
  { source: '09-secondo-di-pesce/al-gobbo-di-rialto-secondo-pesce-003.jpg', name: 'fish-wide', widths: [1600] },
  { source: '04-tavoli-e-mise-en-place/al-gobbo-di-rialto-tavolo-005.jpg', name: 'table-wide', widths: [1600] },
  { source: '10-brand-e-menu/al-gobbo-di-rialto-brand-menu-001.jpg', name: 'brand-table-wide', widths: [1600] },
  { source: '10-brand-e-menu/al-gobbo-di-rialto-brand-menu-003.jpg', name: 'brand-detail-wide', widths: [1600] },
  { source: '01-locale-interni/al-gobbo-di-rialto-interno-001.jpg', name: 'interior-wide', widths: [1600] },
  { source: '01-locale-interni/al-gobbo-di-rialto-interno-012.jpg', name: 'interior-bar-wide', widths: [1600] },
  { source: '03-bar-e-cantina/al-gobbo-di-rialto-bar-cantina-004.jpg', name: 'bar-wide', widths: [1600] },
  { source: '03-bar-e-cantina/al-gobbo-di-rialto-bar-cantina-015.jpg', name: 'bar-detail-wide', widths: [1600] },
  { source: '03-bar-e-cantina/al-gobbo-di-rialto-bar-cantina-001.jpg', name: 'wine-wall-portrait', widths: [1200] },
  { source: '04-tavoli-e-mise-en-place/al-gobbo-di-rialto-tavolo-010.jpg', name: 'reserved-table-wide', widths: [1600] },
];

const galleryNames = new Set([
  'bar-detail-wide',
  'bar-wide',
  'brand-detail-wide',
  'brand-table-wide',
  'burrata-wide',
  'exterior-wide',
  'fish-wide',
  'interior-bar-wide',
  'interior-hero',
  'interior-wide',
  'pasta-wide',
  'reserved-table-wide',
  'risotto-wide',
  'staff-wide',
  'table-wide',
  'wine-wall-portrait',
]);

await Promise.all([mkdir(outputRoot, { recursive: true }), mkdir(publicHeroRoot, { recursive: true })]);

let written = 0;
for (const photo of photos) {
  const input = path.resolve(sourceRoot, photo.source);
  for (const width of photo.widths) {
    await sharp(input, { limitInputPixels: false })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width <= 480 ? 70 : 76, effort: 5, smartSubsample: true })
      .toFile(path.join(outputRoot, `${photo.name}-${width}.webp`));
    written += 1;
  }

  if (galleryNames.has(photo.name)) {
    await sharp(input, { limitInputPixels: false })
      .rotate()
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90, effort: 5, smartSubsample: true })
      .toFile(path.join(outputRoot, `${photo.name}-lightbox-2400.webp`));
    written += 1;
  }
}

await sharp(path.resolve(sourceRoot, photos[0].source), { limitInputPixels: false })
  .rotate()
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(path.join(publicHeroRoot, 'al-gobbo-rialto.jpg'));

console.log(`Prepared ${written} responsive WebP assets and one social preview.`);
