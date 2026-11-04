(function () {
  'use strict';
  var KEY = 'avin:rolador-de-dados:historico';
  var form = document.getElementById('form');
  var qty = document.getElementById('qty');
  var sides = document.getElementById('sides');
  var mod = document.getElementById('mod');
  var total = document.getElementById('total');
  var detail = document.getElementById('detail');
  var log = document.getElementById('log');
  var clear = document.getElementById('clear');

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* armazenamento indisponível */ }
  }
  var history = load();

  function roll(n) {
    // crypto.getRandomValues evita viés do módulo com rejeição simples
    var max = Math.floor(4294967296 / n) * n, buf = new Uint32Array(1);
    do { crypto.getRandomValues(buf); } while (buf[0] >= max);
    return (buf[0] % n) + 1;
  }
  function fmtMod(m) { return m === 0 ? '' : (m > 0 ? ' + ' + m : ' − ' + Math.abs(m)); }

  function render() {
    log.innerHTML = '';
    if (!history.length) {
      var li = document.createElement('li'); li.className = 'none'; li.textContent = 'Nenhuma rolagem ainda.';
      log.appendChild(li); return;
    }
    history.forEach(function (h) {
      var li = document.createElement('li');
      var a = document.createElement('span'); a.className = 'expr'; a.textContent = h.expr + ' [' + h.dice.join(', ') + ']';
      var b = document.createElement('strong'); b.textContent = h.total;
      li.appendChild(a); li.appendChild(b); log.appendChild(li);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = Math.min(20, Math.max(1, parseInt(qty.value, 10) || 1));
    var s = parseInt(sides.value, 10);
    var m = Math.min(99, Math.max(-99, parseInt(mod.value, 10) || 0));
    qty.value = q; mod.value = m;
    var dice = [], sum = 0;
    for (var i = 0; i < q; i++) { var r = roll(s); dice.push(r); sum += r; }
    var t = sum + m, expr = q + 'd' + s + fmtMod(m);
    total.textContent = t;
    detail.textContent = expr + ' → [' + dice.join(', ') + ']' + fmtMod(m);
    total.classList.remove('pop'); void total.offsetWidth; total.classList.add('pop');
    history.unshift({ expr: expr, dice: dice, total: t });
    history = history.slice(0, 10);
    save(history); render();
  });

  clear.addEventListener('click', function () { history = []; save(history); render(); });
  render();
})();
