document.addEventListener('DOMContentLoaded', () => {

  /* ── TERMINAL TYPING ─────────────────────────────────────── */
  const tb = document.getElementById('tb');
  if (!tb) return;

  const sequence = [
    { kind: 'prompt', text: '$ whoami' },
    { kind: 'out',    html: '  <span class="t-key">Manoj Kumar R</span>' },
    { kind: 'blank' },
    { kind: 'prompt', text: '$ cat role.txt' },
    { kind: 'out',    html: '  <span class="t-val">Azure DevOps &amp; Platform Engineer</span>' },
    { kind: 'blank' },
    { kind: 'prompt', text: '$ terraform show --achievements' },
    { kind: 'out',    html: '  <span class="t-check">✓</span> PLZ deployed in <span class="t-key">1 week</span>  <span class="t-dim">(industry avg: 4 weeks)</span>' },
    { kind: 'out',    html: '  <span class="t-check">✓</span> <span class="t-key">99.9%</span> production uptime maintained' },
    { kind: 'out',    html: '  <span class="t-check">✓</span> deployments <span class="t-key">75% faster</span> via PowerShell automation' },
    { kind: 'blank' },
    { kind: 'prompt', text: '$ git log --oneline --my-work' },
    { kind: 'out',    html: '  <span class="t-dim">a3f2c1d</span>  ALZ Terraform deployment    <span class="t-check">RUNNING</span>' },
    { kind: 'out',    html: '  <span class="t-dim">b7e9f2a</span>  OIDC federation configured  <span class="t-check">RUNNING</span>' },
    { kind: 'out',    html: '  <span class="t-dim">c4d8a3e</span>  State corruption recovered  <span class="t-check">RUNNING</span>' },
  ];

  let si = 0;   // sequence index
  let ci = 0;   // character index
  let el = null;

  function next() {
    if (si >= sequence.length) {
      const cur = document.createElement('span');
      cur.className = 't-cursor';
      tb.appendChild(cur);
      return;
    }

    const item = sequence[si];

    if (item.kind === 'blank') {
      tb.appendChild(document.createElement('br'));
      si++; ci = 0;
      setTimeout(next, 100);
      return;
    }

    // Output lines: render HTML at once, short pause
    if (item.kind === 'out') {
      if (ci === 0) {
        el = document.createElement('span');
        el.className = 't-line';
        tb.appendChild(el);
        tb.appendChild(document.createElement('br'));
      }
      el.innerHTML = item.html;
      si++; ci = 0;
      setTimeout(next, 65);
      return;
    }

    // Prompt lines: type char by char
    if (ci === 0) {
      el = document.createElement('span');
      el.className = 't-line t-prompt';
      tb.appendChild(el);
      tb.appendChild(document.createElement('br'));
    }

    if (ci < item.text.length) {
      el.textContent += item.text[ci];
      ci++;
      setTimeout(next, 48);
    } else {
      si++; ci = 0;
      setTimeout(next, item.kind === 'prompt' ? 320 : 60);
    }
  }

  setTimeout(next, 700);


  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


  /* ── COUNTER ANIMATION ──────────────────────────────────── */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = '1';

      const target   = parseFloat(entry.target.dataset.target);
      const suffix   = entry.target.dataset.suffix || '';
      const isFloat  = !Number.isInteger(target);
      const duration = 1600;
      const t0       = performance.now();

      function tick(now) {
        const p = Math.min((now - t0) / duration, 1);
        const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
        const v = target * e;
        entry.target.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else entry.target.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));


  /* ── ACTIVE NAV ─────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => navObs.observe(s));


  /* ── SMOOTH SCROLL ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

});