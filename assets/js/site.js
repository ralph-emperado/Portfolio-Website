// Shared chrome for the sidebar-layout pages: sidebar, page dots, CTA, network background.
// Set <body data-page="home|work|results|services|credentials|testimonials|about|contact">.
(function () {
  const I = {
    home: '<path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    work: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    results: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    services: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    credentials: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
    testimonials: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    about: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'
  };
  const pages = [
    ['home', 'index.html', 'Home'], ['work', 'live-system.html', 'Portfolio'],
    ['results', 'real-result.html', 'Real Result'], ['services', 'services.html', 'Services'],
    ['credentials', 'credentials.html', 'Credentials'], ['testimonials', 'testimonials.html', 'Testimonials'],
    ['about', 'about.html', 'About me'], ['contact', 'contact.html', 'Contact']
  ];
  const cur = document.body.dataset.page;
  const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

  document.body.insertAdjacentHTML('afterbegin', `
    <canvas id="net" aria-hidden="true"></canvas><div class="vignette"></div>
    <aside class="side">
      <a class="logo" href="index.html" aria-label="Home"><img src="assets/img/logo.png" alt="Ralph Emperado logo"></a>
      <nav>${pages.map(([k, h, l]) => `<a href="${h}" data-label="${l}" aria-label="${l}" class="${k === cur ? 'on' : ''}">${svg(I[k])}</a>`).join('')}</nav>
      <div class="open"><i></i>OPEN<br>FOR WORK</div>
    </aside>
    <a class="touch" href="consult.html">${svg('<path d="m5 12 14-8-4 16-3-6z"/>')} Get in touch</a>
    <div class="dots">${pages.map(([k, h, l]) => `<a href="${h}" aria-label="${l}" class="${k === cur ? 'on' : ''}"></a>`).join('')}</div>`);

  // keyboard: arrow keys move between pages
  const idx = pages.findIndex(p => p[0] === cur);
  addEventListener('keydown', e => {
    if (e.target.closest('input,textarea')) return;
    if (e.key === 'ArrowRight' && idx < pages.length - 1) location.href = pages[idx + 1][1];
    if (e.key === 'ArrowLeft' && idx > 0) location.href = pages[idx - 1][1];
  });

  // network background
  const c = document.getElementById('net'), x = c.getContext('2d');
  let w, h, pts;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    w = c.width = innerWidth * devicePixelRatio; h = c.height = innerHeight * devicePixelRatio;
    const n = Math.min(90, Math.round(innerWidth * innerHeight / 16000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.6 + .6 }));
  }
  function draw() {
    x.clearRect(0, 0, w, h);
    const max = 150 * devicePixelRatio;
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < max) { x.strokeStyle = `rgba(139,92,246,${(1 - d / max) * .28})`; x.lineWidth = devicePixelRatio * .7; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
    }
    for (const p of pts) { x.fillStyle = 'rgba(196,181,253,.55)'; x.beginPath(); x.arc(p.x, p.y, p.r * devicePixelRatio, 0, 7); x.fill(); }
    if (!reduce) requestAnimationFrame(draw);
  }
  addEventListener('resize', size); size(); draw();
})();
