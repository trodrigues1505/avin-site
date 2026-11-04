// Confere links/recursos internos do build (dist/) respeitando BASE_PATH.
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const dist = 'dist';
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const htmls = walk(dist).filter((f) => extname(f) === '.html');
const bad = []; let checked = 0;
for (const f of htmls) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    let u = m[1];
    if (/^(https?:|mailto:|data:|\/\/)/.test(u)) continue;
    checked++;
    if (!u.startsWith('/')) {
      // relativo: resolve a partir da pasta do próprio HTML (caso dos apps independentes)
      const p = join(f, '..', decodeURIComponent(u));
      if (!existsSync(p)) bad.push(`${f}: ${u} não existe`);
      continue;
    }
    if (base && !u.startsWith(base + '/') && u !== base) { bad.push(`${f}: fora do base ${u}`); continue; }
    const rel = decodeURIComponent(u.slice(base.length)).replace(/^\//, '');
    const p = join(dist, rel);
    const ok = existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html')));
    if (!ok) bad.push(`${f}: ${u} não existe`);
  }
}
console.log(`${htmls.length} páginas, ${checked} links/recursos internos verificados.`);
if (bad.length) { console.log('PROBLEMAS:\n' + [...new Set(bad)].join('\n')); process.exit(1); }
console.log('Sem links quebrados.');
