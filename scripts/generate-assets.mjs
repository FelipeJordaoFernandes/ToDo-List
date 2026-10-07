import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const source = process.argv[2];
if (!source) throw Error('Informe o PNG original gerado por imagegen.');
await sharp(source).resize({ width: 1536, withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toFile('public/desk-1536.webp');
await sharp(process.argv[3] || source).resize({ width: 768 }).webp({ quality: 78, effort: 6 }).toFile('public/desk-mobile.webp');
const icon = await readFile('public/favicon.svg');
await sharp(icon).resize(32, 32).png().toFile('public/favicon.png');
await sharp(icon).resize(180, 180).png().toFile('public/apple-touch-icon.png');
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#e7eee3"/><rect x="90" y="70" width="1020" height="490" rx="32" fill="#fcfcf7"/><rect x="150" y="130" width="72" height="72" rx="20" fill="#245f3a"/><path d="m169 165 12 12 23-28" fill="none" stroke="#fcfcf7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><text x="150" y="309" font-family="Segoe UI,sans-serif" font-size="78" font-weight="600" fill="#202824">To Do List</text><text x="150" y="379" font-family="Segoe UI,sans-serif" font-size="32" fill="#58665b">Organize o dia. Abra espaço para o que importa.</text><text x="150" y="476" font-family="Segoe UI,sans-serif" font-size="22" fill="#245f3a">UM PASSO DE CADA VEZ</text></svg>`;
await sharp(Buffer.from(social)).png().toFile('public/social-card.png');
