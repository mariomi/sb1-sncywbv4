import path from 'node:path';
import sharp from 'sharp';

const introPhotos = [
  'src/Img/G1/IMG_2922.webp',
  'src/Img/G1/IMG_2934.webp',
  'src/Img/G1/IMG_2939.webp',
  'src/Img/G1/IMG_2944.webp',
  'src/Img/G1/IMG_2965.webp',
  'src/Img/G1/IMG_2995.webp',
];

const widths = [480, 900, 1200];

let written = 0;

for (const input of introPhotos) {
  const extension = path.extname(input);
  const stem = input.slice(0, -extension.length);
  const metadata = await sharp(input).metadata();

  for (const width of widths) {
    if ((metadata.width ?? 0) < width) continue;
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width === 480 ? 68 : 72, effort: 5, smartSubsample: true })
      .toFile(`${stem}-${width}.webp`);
    written += 1;
  }
}

console.log(`Generated ${written} responsive intro images.`);
