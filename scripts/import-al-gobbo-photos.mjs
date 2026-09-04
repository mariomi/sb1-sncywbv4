import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const sourceRoot = process.argv[2];
if (!sourceRoot) {
  throw new Error('Pass the Al gobbo source folder as the first argument.');
}

const outputRoot = path.resolve('src/Img/al-gobbo-2026');
const publicHeroRoot = path.resolve('public/images/hero');
const galleryOutputRoot = path.resolve('public/images/gallery');
const galleryManifestPath = path.resolve('src/data/galleryImages.ts');

const galleryCategories = [
  { id: 'interiors', folder: '01-locale-interni' },
  { id: 'exterior', folder: '02-esterno-ingresso' },
  { id: 'bar', folder: '03-bar-e-cantina' },
  { id: 'tables', folder: '04-tavoli-e-mise-en-place' },
  { id: 'staff', folder: '05-staff' },
  { id: 'burrata', folder: '06-burrata-e-pomodorini' },
  { id: 'pasta', folder: '07-pasta' },
  { id: 'risotto', folder: '08-risotto' },
  { id: 'fish', folder: '09-secondo-di-pesce' },
  { id: 'brand', folder: '10-brand-e-menu' },
];

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

await Promise.all([
  mkdir(outputRoot, { recursive: true }),
  mkdir(publicHeroRoot, { recursive: true }),
  mkdir(path.join(galleryOutputRoot, 'preview'), { recursive: true }),
  mkdir(path.join(galleryOutputRoot, 'full'), { recursive: true }),
  mkdir(path.dirname(galleryManifestPath), { recursive: true }),
]);

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

const galleryJobs = [];

for (const category of galleryCategories) {
  const categoryRoot = path.resolve(sourceRoot, category.folder);
  const files = (await readdir(categoryRoot))
    .filter((file) => /\.(?:jpe?g|png|webp|avif)$/i.test(file))
    .sort((left, right) => left.localeCompare(right, 'it', { numeric: true }));

  files.forEach((file, index) => {
    const sequence = Number(file.match(/(\d+)(?=\.[^.]+$)/)?.[1] ?? index + 1);
    galleryJobs.push({
      categoryId: category.id,
      input: path.join(categoryRoot, file),
      id: `${category.id}-${String(sequence).padStart(3, '0')}`,
      sequence,
    });
  });
}

const galleryImages = new Array(galleryJobs.length);
const concurrency = 4;

for (let start = 0; start < galleryJobs.length; start += concurrency) {
  const batch = galleryJobs.slice(start, start + concurrency);
  await Promise.all(batch.map(async (photo, batchIndex) => {
    const previewPath = path.join(galleryOutputRoot, 'preview', `${photo.id}.webp`);
    const fullPath = path.join(galleryOutputRoot, 'full', `${photo.id}.webp`);
    const image = sharp(photo.input, { limitInputPixels: false }).rotate();

    await Promise.all([
      image
        .clone()
        .resize({ width: 960, height: 960, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 72, effort: 4, smartSubsample: true })
        .toFile(previewPath),
      image
        .clone()
        .resize({ width: 2200, height: 2200, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 84, effort: 4, smartSubsample: true })
        .toFile(fullPath),
    ]);

    const [previewMetadata, fullMetadata] = await Promise.all([
      sharp(previewPath).metadata(),
      sharp(fullPath).metadata(),
    ]);

    galleryImages[start + batchIndex] = {
      id: photo.id,
      categoryId: photo.categoryId,
      sequence: photo.sequence,
      previewUrl: `/images/gallery/preview/${photo.id}.webp`,
      fullUrl: `/images/gallery/full/${photo.id}.webp`,
      width: previewMetadata.width,
      height: previewMetadata.height,
      fullWidth: fullMetadata.width,
      fullHeight: fullMetadata.height,
    };
  }));

  console.log(`Gallery photos: ${Math.min(start + concurrency, galleryJobs.length)}/${galleryJobs.length}`);
}

const manifest = `// Generated by scripts/import-al-gobbo-photos.mjs. Do not edit by hand.\n\nexport const galleryCategories = ${JSON.stringify(galleryCategories.map(({ id }) => id), null, 2)} as const;\n\nexport type GalleryCategoryId = (typeof galleryCategories)[number];\n\nexport type GalleryImage = {\n  id: string;\n  categoryId: GalleryCategoryId;\n  sequence: number;\n  previewUrl: string;\n  fullUrl: string;\n  width: number;\n  height: number;\n  fullWidth: number;\n  fullHeight: number;\n};\n\nexport const galleryImages: GalleryImage[] = ${JSON.stringify(galleryImages, null, 2)};\n`;

await writeFile(galleryManifestPath, manifest, 'utf8');

console.log(`Prepared ${written} responsive site assets, one social preview and ${galleryImages.length} complete gallery photos.`);
