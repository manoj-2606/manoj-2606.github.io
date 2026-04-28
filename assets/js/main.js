document.addEventListener('DOMContentLoaded', () => {

  /* ── PARTICLE CANVAS ─────────────────────────────────────── */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function rand(min, max) { return Math.random() * (max - min) + min; }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = rand(0, W);
        this.y  = rand(0, H);
        this.vx = rand(-0.18, 0.18);
        this.vy = rand(-0.18, 0.18);
        this.r  = rand(0.8, 2.2);
        this.a  = rand(0.1, 0.5);
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${this.a})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 90; i++) particles.push(new Particle());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,229,255,${0.055 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ── TERMINAL TYPING ─────────────────────────────────────── */
  const tb = document.getElementById('tb');
  if (tb) {
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

    let si = 0, ci = 0, el = null;

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
  }

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── STAGGER SKILL TAGS ─────────────────────────────────── */
  const stackObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const tags = entry.target.querySelectorAll('.s-tag');
      tags.forEach((tag, i) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(12px)';
        setTimeout(() => {
          tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          tag.style.opacity = '1';
          tag.style.transform = 'translateY(0)';
        }, i * 55);
      });
      stackObs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.stack-group').forEach(g => stackObs.observe(g));

  /* ── COUNTER ANIMATION ──────────────────────────────────── */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = '1';
      const target  = parseFloat(entry.target.dataset.target);
      const suffix  = entry.target.dataset.suffix || '';
      const isFloat = !Number.isInteger(target);
      const dur     = 1600;
      const t0      = performance.now();
      function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
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
  const sections   = document.querySelectorAll('section[id]');
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

  /* ── CURSOR GLOW ────────────────────────────────────────── */
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;width:300px;height:300px;border-radius:50%;
    background:radial-gradient(circle,rgba(0,229,255,0.04) 0%,transparent 70%);
    pointer-events:none;z-index:0;transform:translate(-50%,-50%);
    transition:left 0.18s ease,top 0.18s ease;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });

  /* ── SMOOTH SCROLL ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

});