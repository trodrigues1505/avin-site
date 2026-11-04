(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const LS_CFG = 'avin-editor:cfg', LS_DRAFT = 'avin-editor:rascunho';
  const POSTS_DIR = 'src/content/articles', IMG_DIR = 'src/assets/posts';
  const IMG_REL = '../../assets/posts/';

  // ---------- configuração ----------
  function guessRepo() {
    const h = location.hostname, p = location.pathname.split('/').filter(Boolean);
    if (h.endsWith('.github.io') && p.length > 1) return { owner: h.split('.')[0], repo: p[0] };
    return { owner: 'trodrigues1505', repo: 'avin-site' };
  }
  function loadCfg() { try { return JSON.parse(localStorage.getItem(LS_CFG)) || null; } catch { return null; } }
  function saveCfg(c) { try { localStorage.setItem(LS_CFG, JSON.stringify(c)); } catch { /* sem armazenamento */ } }
  let cfg = loadCfg();

  // ---------- estado ----------
  const S = { posts: [], cur: null, pending: new Map(), cover: null, busy: false };

  // ---------- utilidades ----------
  let toastTimer;
  function toast(html, err = false, ms = 6000) {
    const t = $('#toast'); t.innerHTML = html; t.className = 'on' + (err ? ' err' : '');
    clearTimeout(toastTimer); if (ms) toastTimer = setTimeout(() => { t.className = ''; }, ms);
  }
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  function slugify(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  const today = () => new Date().toISOString().slice(0, 10);
  function show(view) { document.querySelectorAll('[data-view]').forEach((e) => { e.hidden = e.dataset.view !== view; }); window.scrollTo(0, 0); }
  function b64FromText(t) { const b = new TextEncoder().encode(t); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); }
  function textFromB64(b) { const s = atob(b.replace(/\n/g, '')); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return new TextDecoder().decode(u); }
  function b64FromBlob(blob) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = () => rej(new Error('Falha ao ler a imagem.')); r.readAsDataURL(blob); }); }

  // ---------- GitHub API ----------
  function friendly(status, msg) {
    if (status === 401) return 'Token inválido ou expirado. Gere outro nas configurações do GitHub e reconecte.';
    if (status === 403) return 'Sem permissão (ou limite de uso do GitHub). Confira se o token tem “Contents: Read and write” neste repositório.';
    if (status === 404) return 'Não encontrado. Confira usuário, repositório e branch, e se o token tem acesso a este repositório.';
    if (status === 409 || status === 422) return 'Conflito: o arquivo mudou no GitHub. Volte à lista e abra a postagem de novo.';
    return 'Erro do GitHub (' + status + '). ' + (msg || '');
  }
  async function gh(path, { method = 'GET', body, raw = false } = {}) {
    const r = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/${path}`, {
      method,
      headers: Object.assign({ Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json', Authorization: 'Bearer ' + cfg.token, 'X-GitHub-Api-Version': '2022-11-28' }, body ? { 'Content-Type': 'application/json' } : {}),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) { let m = ''; try { m = (await r.json()).message; } catch { /* sem corpo */ } const e = new Error(friendly(r.status, m)); e.status = r.status; throw e; }
    if (r.status === 204) return null;
    return raw ? r.text() : r.json();
  }
  const ref = () => '?ref=' + encodeURIComponent(cfg.branch);
  const putFile = (path, contentB64, message, sha) => gh('contents/' + encodeURI(path), { method: 'PUT', body: Object.assign({ message, content: contentB64, branch: cfg.branch }, sha ? { sha } : {}) });

  // ---------- frontmatter ----------
  function parseFM(text) {
    const t = text.replace(/\r\n/g, '\n');
    const m = t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) return { data: {}, body: t };
    const data = {};
    for (const line of m[1].split('\n')) {
      const k = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/); if (!k) continue;
      let v = k[2].trim();
      if (v === 'true') v = true; else if (v === 'false') v = false;
      else if (v.startsWith('[') || v.startsWith('"')) { try { v = JSON.parse(v); } catch { v = v.replace(/^"|"$/g, ''); } }
      else if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
      data[k[1]] = v;
    }
    return { data, body: m[2].replace(/^\n+/, '') };
  }
  const KNOWN = ['title', 'description', 'date', 'updated', 'author', 'category', 'tags', 'cover', 'coverAlt', 'draft', 'originalUrl'];
  function buildFM(d, extra) {
    const out = ['---'];
    const put = (k, v) => out.push(`${k}: ${typeof v === 'string' ? JSON.stringify(v) : Array.isArray(v) ? JSON.stringify(v) : v}`);
    put('title', d.title); put('description', d.description); out.push('date: ' + d.date);
    if (d.updated) out.push('updated: ' + d.updated);
    put('author', d.author); put('category', d.category); put('tags', d.tags);
    if (d.cover) { put('cover', d.cover); put('coverAlt', d.coverAlt || ''); }
    if (d.draft) put('draft', true);
    if (d.originalUrl) put('originalUrl', d.originalUrl);
    for (const k of Object.keys(extra || {})) if (!KNOWN.includes(k)) put(k, extra[k]);
    out.push('---');
    return out.join('\n');
  }

  // ---------- prévia (Markdown simples) ----------
  function imgSrc(u) {
    const name = u.split('/').pop();
    if (u.startsWith(IMG_REL)) {
      const p = S.pending.get(name); if (p) return p.url;
      return `https://raw.githubusercontent.com/${cfg.owner}/${cfg.repo}/${cfg.branch}/${IMG_DIR}/${name}`;
    }
    return /^https?:\/\//.test(u) ? u : '';
  }
  const safeHref = (u) => (/^(https?:|mailto:|#|\/)/.test(u) ? u : '#');
  function inline(s) {
    s = esc(s);
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => `<img src="${esc(imgSrc(u.replace(/&amp;/g, '&')))}" alt="${a}">`);
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${esc(safeHref(u.replace(/&amp;/g, '&')))}" rel="noopener">${t}</a>`);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    return s;
  }
  function md(text) {
    const blocks = text.replace(/\r\n/g, '\n').split(/\n{2,}/); let html = '';
    for (const b of blocks) {
      const lines = b.split('\n'); const first = lines[0];
      if (!b.trim()) continue;
      let m;
      if ((m = first.match(/^(#{2,3})\s+(.*)$/)) && lines.length === 1) html += `<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`;
      else if (lines.every((l) => /^[-*]\s+/.test(l))) html += '<ul>' + lines.map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`).join('') + '</ul>';
      else if (lines.every((l) => /^>\s?/.test(l))) html += `<blockquote>${inline(lines.map((l) => l.replace(/^>\s?/, '')).join(' '))}</blockquote>`;
      else {
        let p = '';
        lines.forEach((l, i) => { p += inline(l.replace(/\s+$/, '')); if (i < lines.length - 1) p += /( {2,}|\\)$/.test(l) ? '<br>' : ' '; });
        html += `<p>${p}</p>`;
      }
    }
    return html;
  }
  function renderPreview() {
    const d = readForm();
    const cov = S.cover && (S.cover.url || (S.cover.path ? imgSrc(S.cover.path) : ''));
    $('#pane-p').innerHTML = `<h1>${esc(d.title || 'Sem título')}</h1><div class="meta">${esc(d.author)} · ${esc(d.date)} · ${esc(d.category || 'sem categoria')}</div>` + (cov ? `<p><img src="${esc(cov)}" alt="${esc(d.coverAlt || '')}"></p>` : '') + md($('#f-body').value);
    const words = ($('#f-body').value.trim().match(/\S+/g) || []).length;
    $('#count').textContent = `${words} palavras · ${Math.max(1, Math.round(words / 200))} min de leitura`;
  }

  // ---------- formulário ----------
  function readForm() {
    return {
      title: $('#f-title').value.trim(), description: $('#f-desc').value.trim(), date: $('#f-date').value,
      category: $('#f-cat').value.trim(), author: $('#f-author').value.trim() || 'Thiago Rodrigues',
      tags: $('#f-tags').value.split(',').map((t) => t.trim()).filter(Boolean),
      coverAlt: $('#f-coveralt').value.trim(), slug: $('#f-slug').value.trim(),
    };
  }
  function setCover(c) {
    S.cover = c;
    const img = $('#cover-prev'); const src = c && (c.url || (c.path ? imgSrc(c.path) : ''));
    img.hidden = !src; if (src) img.src = src; $('#btn-cover-rm').hidden = !c;
  }
  function fillForm(post) {
    const d = post.data || {};
    $('#f-title').value = d.title || ''; $('#f-desc').value = d.description || '';
    $('#f-date').value = d.date ? String(d.date).slice(0, 10) : today();
    $('#f-cat').value = d.category || ''; $('#f-author').value = d.author || 'Thiago Rodrigues';
    $('#f-tags').value = Array.isArray(d.tags) ? d.tags.join(', ') : '';
    $('#f-coveralt').value = d.coverAlt || ''; $('#f-slug').value = post.slug || '';
    $('#f-slug').readOnly = !post.isNew; $('#f-body').value = post.body || '';
    $('#f-slug').dataset.manual = post.isNew ? '' : '1';
    setCover(d.cover ? { path: d.cover } : null);
    $('#btn-delete').hidden = post.isNew; $('#btn-delete').classList.remove('armed'); $('#btn-delete').textContent = 'Excluir';
    $('#status').textContent = post.isNew ? 'Nova postagem' : 'Editando: ' + post.slug;
    $('.split').dataset.tab = 'w';
    $('#tab-w').setAttribute('aria-selected', 'true'); $('#tab-p').setAttribute('aria-selected', 'false');
    renderPreview();
  }

  // ---------- imagens ----------
  async function processImage(file) {
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return { blob: file, ext: (file.type.split('/')[1] || 'png').replace('jpeg', 'jpg').replace('svg+xml', 'svg') };
    const bmp = await createImageBitmap(file); const MAX = 1600;
    const k = Math.min(1, MAX / bmp.width); const w = Math.round(bmp.width * k), h = Math.round(bmp.height * k);
    const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(bmp, 0, 0, w, h);
    const png = file.type === 'image/png';
    const blob = await new Promise((r) => c.toBlob(r, png ? 'image/png' : 'image/jpeg', 0.86));
    return { blob, ext: png ? 'png' : 'jpg' };
  }
  async function addImage(file) {
    const { blob, ext } = await processImage(file);
    const base = slugify($('#f-slug').value || $('#f-title').value) || 'imagem';
    const name = `${base}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const url = URL.createObjectURL(blob); S.pending.set(name, { blob, url });
    return { name, url };
  }

  // ---------- lista ----------
  async function loadPosts() {
    $('#post-list').innerHTML = '<p class="muted">Carregando…</p>';
    const files = await gh('contents/' + POSTS_DIR + ref());
    S.posts = await Promise.all(files.filter((f) => /\.md$/.test(f.name)).map(async (f) => {
      const t = await gh('contents/' + encodeURI(f.path) + ref(), { raw: true });
      return { slug: f.name.replace(/\.md$/, ''), path: f.path, data: parseFM(t).data };
    }));
    S.posts.sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)));
    renderList();
    $('#cats').innerHTML = [...new Set(S.posts.map((p) => p.data.category).filter(Boolean))].map((c) => `<option value="${esc(c)}">`).join('');
  }
  function renderList() {
    const box = $('#post-list');
    if (!S.posts.length) { box.innerHTML = '<p class="muted">Nenhuma postagem ainda. Clique em “Nova postagem”.</p>'; return; }
    box.innerHTML = S.posts.map((p, i) => `<div class="item"><div><h2>${esc(p.data.title || p.slug)}${p.data.draft ? '<span class="badge">rascunho</span>' : ''}</h2><span class="muted small">${esc(String(p.data.date).slice(0, 10))} · ${esc(p.data.category || '')}</span></div><button type="button" data-i="${i}">Editar</button></div>`).join('');
  }
  async function openPost(i) {
    const p = S.posts[i]; toast('Abrindo…', false, 1500);
    const f = await gh('contents/' + encodeURI(p.path) + ref());
    const { data, body } = parseFM(textFromB64(f.content));
    S.cur = { isNew: false, path: p.path, sha: f.sha, extra: data };
    S.pending.clear(); fillForm({ data, body, slug: p.slug, isNew: false }); show('edit');
  }
  function newPost() {
    S.cur = { isNew: true, path: null, sha: null, extra: {} }; S.pending.clear();
    let post = { data: { date: today(), author: 'Thiago Rodrigues' }, body: '', slug: '', isNew: true };
    try { const d = JSON.parse(localStorage.getItem(LS_DRAFT)); if (d && (d.title || d.body) && confirm('Há um texto não publicado salvo neste navegador. Recuperar?')) post = { data: { title: d.title, description: d.description, date: d.date || today(), category: d.category, author: d.author, tags: d.tags, coverAlt: d.coverAlt }, body: d.body, slug: d.slug, isNew: true }; } catch { /* ignora */ }
    fillForm(post); show('edit');
  }

  // ---------- salvar ----------
  function setBusy(b) { S.busy = b; ['#btn-publish', '#btn-draft', '#btn-delete'].forEach((s) => { $(s).disabled = b; }); }
  async function save(asDraft) {
    if (S.busy) return;
    const d = readForm(); const body = $('#f-body').value;
    if (S.cur.isNew && !$('#f-slug').dataset.manual) d.slug = slugify(d.title);
    const err = !d.title ? 'Escreva um título.' : !d.description ? 'Escreva o resumo.' : !d.category ? 'Informe a categoria.' : !/^\d{4}-\d{2}-\d{2}$/.test(d.date) ? 'Informe a data.' : !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug) ? 'O endereço deve ter só letras minúsculas, números e hífens.' : S.cover && !d.coverAlt ? 'Descreva a imagem de capa (para acessibilidade).' : '';
    if (err) { toast(esc(err), true); return; }
    setBusy(true); toast('Enviando para o GitHub…', false, 0);
    try {
      const path = S.cur.isNew ? `${POSTS_DIR}/${d.slug}.md` : S.cur.path;
      if (S.cur.isNew) { try { await gh('contents/' + encodeURI(path) + ref()); throw Object.assign(new Error('Já existe uma postagem com este endereço. Mude o endereço.'), { mine: true }); } catch (e) { if (e.mine) throw e; if (e.status !== 404) throw e; } }
      // imagens usadas
      const used = new Set(); const rx = /\.\.\/\.\.\/assets\/posts\/([\w.-]+)/g; let m;
      while ((m = rx.exec(body))) used.add(m[1]);
      let coverPath = S.cover ? S.cover.path : '';
      if (S.cover && S.cover.name) { used.add(S.cover.name); coverPath = IMG_REL + S.cover.name; }
      for (const name of used) { const p = S.pending.get(name); if (!p) continue; await putFile(`${IMG_DIR}/${name}`, await b64FromBlob(p.blob), 'Imagem: ' + d.title); S.pending.delete(name); }
      const fm = Object.assign({}, d, { cover: coverPath || '', draft: asDraft, originalUrl: S.cur.extra.originalUrl, updated: S.cur.isNew ? '' : today() });
      const text = buildFM(fm, S.cur.extra) + '\n\n' + body.replace(/\s+$/, '') + '\n';
      const res = await putFile(path, b64FromText(text), (asDraft ? 'Rascunho: ' : S.cur.isNew ? 'Publicar: ' : 'Atualizar: ') + d.title, S.cur.sha);
      S.cur = { isNew: false, path, sha: res.content.sha, extra: Object.assign({}, S.cur.extra, { originalUrl: S.cur.extra.originalUrl }) };
      if (S.cover && S.cover.name) S.cover = { path: coverPath };
      $('#f-slug').readOnly = true; $('#btn-delete').hidden = false; $('#status').textContent = 'Editando: ' + d.slug;
      try { localStorage.removeItem(LS_DRAFT); } catch { /* ignora */ }
      const actions = `https://github.com/${cfg.owner}/${cfg.repo}/actions`;
      toast(asDraft ? 'Rascunho salvo no GitHub. Não aparece no site.' : `Publicado! O site atualiza em 1 a 3 minutos. <a href="${actions}" target="_blank" rel="noopener">Acompanhar</a> · <a href="../artigos/${esc(d.slug)}/" target="_blank" rel="noopener">Ver no site</a>`, false, 14000);
    } catch (e) { toast(esc(e.message), true, 0); } finally { setBusy(false); }
  }
  async function del() {
    const b = $('#btn-delete');
    if (!b.classList.contains('armed')) { b.classList.add('armed'); b.textContent = 'Clique de novo para excluir'; setTimeout(() => { b.classList.remove('armed'); b.textContent = 'Excluir'; }, 5000); return; }
    setBusy(true);
    try { await gh('contents/' + encodeURI(S.cur.path), { method: 'DELETE', body: { message: 'Excluir: ' + $('#f-title').value, sha: S.cur.sha, branch: cfg.branch } }); toast('Postagem excluída. O histórico do GitHub permite restaurar.'); await loadPosts(); show('list'); }
    catch (e) { toast(esc(e.message), true, 0); } finally { setBusy(false); }
  }

  // ---------- toolbar ----------
  function wrap(a, b = a, ph = '') { const t = $('#f-body'); const s = t.selectionStart, e = t.selectionEnd; const sel = t.value.slice(s, e) || ph; t.setRangeText(a + sel + b, s, e, 'end'); t.focus(); onInput(); }
  function linePrefix(p) { const t = $('#f-body'); let s = t.selectionStart; const st = t.value.lastIndexOf('\n', s - 1) + 1; t.setRangeText(p, st, st, 'end'); t.focus(); onInput(); }
  function onInput() { renderPreview(); try { const d = readForm(); localStorage.setItem(LS_DRAFT, JSON.stringify(Object.assign({}, d, { body: $('#f-body').value }))); } catch { /* ignora */ } }

  // ---------- eventos ----------
  $('#conn-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    cfg = { owner: $('#c-owner').value.trim(), repo: $('#c-repo').value.trim(), branch: $('#c-branch').value.trim() || 'main', token: $('#c-token').value.trim() };
    try {
      const info = await gh(''); if (info.permissions && info.permissions.push === false) throw new Error('Este token só lê o repositório. Ele precisa de “Contents: Read and write”.');
      saveCfg(cfg); $('#c-token').value = ''; await loadPosts(); show('list'); toast('Conectado.', false, 2500);
    } catch (er) { cfg = loadCfg(); toast(esc(er.message), true, 0); }
  });
  $('#btn-conn').addEventListener('click', () => { const g = guessRepo(); $('#c-owner').value = (cfg && cfg.owner) || g.owner; $('#c-repo').value = (cfg && cfg.repo) || g.repo; $('#c-branch').value = (cfg && cfg.branch) || 'main'; $('#btn-logout').hidden = !cfg; show('conn'); });
  $('#btn-logout').addEventListener('click', () => { try { localStorage.removeItem(LS_CFG); } catch { /* ignora */ } cfg = null; toast('Token apagado deste navegador.'); $('#btn-conn').click(); });
  $('#btn-new').addEventListener('click', newPost);
  $('#btn-back').addEventListener('click', () => show('list'));
  $('#post-list').addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (b) openPost(+b.dataset.i).catch((er) => toast(esc(er.message), true, 0)); });
  $('#btn-publish').addEventListener('click', () => save(false));
  $('#btn-draft').addEventListener('click', () => save(true));
  $('#btn-delete').addEventListener('click', del);
  $('#f-title').addEventListener('input', () => { const s = $('#f-slug'); if (!s.dataset.manual && !s.readOnly) s.value = slugify($('#f-title').value); });
  $('#f-slug').addEventListener('input', () => { $('#f-slug').dataset.manual = '1'; });
  document.querySelectorAll('#f-title,#f-desc,#f-date,#f-cat,#f-tags,#f-author,#f-coveralt,#f-body').forEach((el) => el.addEventListener('input', onInput));
  $('#f-cover').addEventListener('change', async (e) => { const f = e.target.files[0]; if (!f) return; try { const { name, url } = await addImage(f); setCover({ name, url, path: IMG_REL + name }); renderPreview(); } catch (er) { toast(esc(er.message), true); } e.target.value = ''; });
  $('#btn-cover-rm').addEventListener('click', () => { setCover(null); renderPreview(); });
  $('#f-img').addEventListener('change', async (e) => { const f = e.target.files[0]; if (!f) return; try { const { name } = await addImage(f); const alt = prompt('Descreva a imagem (para leitores de tela):', '') || ''; wrap(`\n\n![${alt}](${IMG_REL}${name})\n\n`, '', ''); } catch (er) { toast(esc(er.message), true); } e.target.value = ''; });
  $('.toolbar').addEventListener('click', (e) => {
    const a = e.target.closest('button')?.dataset.act; if (!a) return;
    ({ h2: () => linePrefix('## '), h3: () => linePrefix('### '), bold: () => wrap('**', '**', 'texto'), italic: () => wrap('*', '*', 'texto'), ul: () => linePrefix('- '), quote: () => linePrefix('> '),
      link: () => { const u = prompt('Endereço do link (https://…):', 'https://'); if (u) wrap('[', `](${u})`, 'texto do link'); }, img: () => $('#f-img').click() })[a]();
  });
  const setTab = (t) => { $('.split').dataset.tab = t; $('#tab-w').setAttribute('aria-selected', String(t === 'w')); $('#tab-p').setAttribute('aria-selected', String(t === 'p')); if (t === 'p') renderPreview(); };
  $('#tab-w').addEventListener('click', () => setTab('w')); $('#tab-p').addEventListener('click', () => setTab('p'));
  window.addEventListener('beforeunload', (e) => { if (S.busy) { e.preventDefault(); e.returnValue = ''; } });

  // ---------- início ----------
  (async function init() {
    if (!cfg || !cfg.token) { $('#btn-conn').click(); return; }
    try { await loadPosts(); show('list'); } catch (e) { toast(esc(e.message), true, 0); $('#btn-conn').click(); }
  })();
})();
