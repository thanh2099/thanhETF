const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'scout_data');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const etfMap = new Map();

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Standard HTML href="/etf/..." title="..."
  const regex = /href=["']\/etf\/([A-Za-z0-9.-]+)["'][^>]*title=["']([^"']+)["']/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const sym = m[1].toUpperCase();
    const title = m[2];
    if (!etfMap.has(sym)) {
      etfMap.set(sym, title);
    }
  }

  // React flight JSON: href\":\"/etf/XYZ.TO\" ... title\":\"...\"
  const jsonRegex = /href\\":\\"\/etf\/([A-Za-z0-9.-]+)\\"[^}]*title\\":\\"([^\\"]+)\\"/g;
  while ((m = jsonRegex.exec(content)) !== null) {
    const sym = m[1].toUpperCase();
    const title = m[2];
    if (!etfMap.has(sym)) {
      etfMap.set(sym, title);
    }
  }

  // Also match simple /etf/XYZ.TO occurrences
  const simpleRegex = /\/etf\/([A-Za-z0-9.-]+(\.TO|\.NE)?)/g;
  while ((m = simpleRegex.exec(content)) !== null) {
    const sym = m[1].toUpperCase();
    if (!etfMap.has(sym) && (sym.endsWith('.TO') || sym.endsWith('.NE') || sym.length <= 5)) {
      etfMap.set(sym, `${sym} ETF`);
    }
  }
}

console.log('Total unique ETFs found:', etfMap.size);
const items = Array.from(etfMap.entries()).map(([sym, name]) => ({ symbol: sym, name }));
fs.writeFileSync(path.join(__dirname, 'scout_data', 'extracted_etfs.json'), JSON.stringify(items, null, 2));
console.log('Saved extracted_etfs.json. Sample 20:');
console.log(items.slice(0, 20));

// Check if XUS, HYLD, HMAX exist in extracted
console.log('Has XUS.TO:', etfMap.has('XUS.TO') || etfMap.has('XUS'));
console.log('Has HYLD.TO:', etfMap.has('HYLD.TO') || etfMap.has('HYLD'));
console.log('Has HMAX.TO:', etfMap.has('HMAX.TO') || etfMap.has('HMAX'));
