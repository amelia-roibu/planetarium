import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawCsvPath = path.join(__dirname, '../public/data/hyg_raw.csv');
const outputPath = path.join(__dirname, '../public/data/stars.json');

console.log('Se procesează catalogul stelar...');

try {
  const fileContent = fs.readFileSync(rawCsvPath, 'utf-8');
  const lines = fileContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

  const idIdx = headers.indexOf('id');
  const properIdx = headers.indexOf('proper');
  const raIdx = headers.indexOf('ra');
  const decIdx = headers.indexOf('dec');
  const magIdx = headers.indexOf('mag');
  const pmraIdx = headers.indexOf('pmra');
  const pmdecIdx = headers.indexOf('pmdec');

  const cleanStars = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Separare linii CSV respectând ghilimelele
    const cols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/"/g, ''));
    
    const mag = parseFloat(cols[magIdx]);

    // Filtrăm doar stelele vizibile (magnitudine <= 6.5)
    if (!isNaN(mag) && mag <= 6.5) {
      cleanStars.push({
        id: parseInt(cols[idIdx], 10),
        name: cols[properIdx] || null,
        ra: parseFloat(cols[raIdx]),
        dec: parseFloat(cols[decIdx]),
        mag: mag,
        pmra: parseFloat(cols[pmraIdx]) || 0,
        pmdec: parseFloat(cols[pmdecIdx]) || 0
      });
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(cleanStars, null, 2));
  console.log(`✅ Succes! Au fost procesate ${cleanStars.length} stele vizibile.`);
  console.log(`Fișier salvat în: ${outputPath}`);

} catch (error) {
  console.error('❌ Eroare la procesarea fișierului:', error.message);
}