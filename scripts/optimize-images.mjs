import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceRoot = path.resolve('src/Img');

async function findPhotos(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const photos = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) photos.push(...await findPhotos(absolutePath));
    else if (/\.(jpe?g)$/i.test(entry.name)) photos.push(absolutePath);
  }

  return photos;
}

const photos = await findPhotos(sourceRoot);
let written = 0;

for (const inputPath of photos) {
  const outputPath = inputPath.replace(/\.(jpe?g)$/i, '.webp');
  const inputStat = await stat(inputPath);
  const outputStat = await stat(outputPath).catch(() => null);
  if (outputStat && outputStat.mtimeMs >= inputStat.mtimeMs) continue;

  await sharp(inputPath)
    .rotate()
    .resize({ width: 1600, height: 2000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78, effort: 5, smartSubsample: true })
    .toFile(outputPath);
  written += 1;
}

console.log(`Optimized ${written} of ${photos.length} source photos.`);
