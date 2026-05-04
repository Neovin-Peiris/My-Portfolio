/* ============================================================
   Neovin Peiris — Digital Architect | main.js
   ============================================================ */

/* ── Three.js Particle Background ── */
(function () {
  const canvas = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Particles
  const count = 1800;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const c1 = new THREE.Color('#00f5ff');
  const c2 = new THREE.Color('#ff00ff');
  const c3 = new THREE.Color('#39ff14');

  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 110;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 110;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 75;

    const t = Math.random();
    const c = t < 0.5
      ? c1.clone().lerp(c2, t * 2)
      : c2.clone().lerp(c3, (t - 0.5) * 2);

    col[i * 3]     = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.28,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
  });

  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  // Decorative line connections
  const lmat = new THREE.LineBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.035 });
  for (let i = 0; i < 18; i++) {
    const lg = new THREE.BufferGeometry();
    lg.setFromPoints([
      new THREE.Vector3((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 40),
      new THREE.Vector3((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 40),
    ]);
    scene.add(new THREE.Line(lg, lmat));
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  (function animate() {
    requestAnimationFrame(animate);
    pts.rotation.y += 0.00018;
    pts.rotation.x += 0.00009;
    camera.position.x += (mx * 2.5 - camera.position.x) * 0.02;
    camera.position.y += (my * 2.5 - camera.position.y) * 0.02;
    camera.position.z  = 30 - scrollY * 0.008;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();


/* ── Custom Cursor ── */
const cur  = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.transform = `translate(${mx - 6}px,${my - 6}px)`;
});

(function loop() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.transform = `translate(${rx - 20}px,${ry - 20}px)`;
  requestAnimationFrame(loop);
})();

// Cursor hover effects
document.querySelectorAll('a,button,.pc,.flip-card,.sc,.tl-content,.btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width       = '58px';
    ring.style.height      = '58px';
    ring.style.borderColor = 'rgba(255,0,255,.65)';
    cur.style.background   = 'var(--nm)';
    cur.style.boxShadow    = '0 0 10px var(--nm),0 0 30px var(--nm)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width       = '40px';
    ring.style.height      = '40px';
    ring.style.borderColor = 'rgba(0,245,255,.4)';
    cur.style.background   = 'var(--nc)';
    cur.style.boxShadow    = '0 0 10px var(--nc),0 0 30px var(--nc),0 0 60px var(--nc)';
  });
});


/* ── Holographic Card 3D Tilt ── */
const holo = document.getElementById('holo-card');
if (holo) {
  const par = holo.closest('.hero-right');
  if (par) {
    par.addEventListener('mousemove', e => {
      const r  = par.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / r.width;
      const dy = (e.clientY - r.top  - r.height / 2) / r.height;
      holo.style.transition = 'transform .08s';
      holo.style.transform  = `rotateY(${dx * 28}deg) rotateX(${-dy * 22}deg) translateZ(22px)`;
    });
    par.addEventListener('mouseleave', () => {
      holo.style.transition = 'transform .7s cubic-bezier(.23,1,.32,1)';
      holo.style.transform  = 'rotateY(0) rotateX(0) translateZ(0)';
    });
  }
}


/* ── Button Magnetic Effect ── */
document.querySelectorAll('.btn').forEach(b => {
  b.addEventListener('mousemove', e => {
    const r  = b.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width  / 2;
    const dy = e.clientY - r.top  - r.height / 2;
    b.style.transform = `translate(${dx * 0.18}px,${dy * 0.18}px)`;
  });
  b.addEventListener('mouseleave', () => {
    b.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
    b.style.transform  = '';
  });
  b.addEventListener('mouseenter', () => {
    b.style.transition = 'transform .1s';
  });
});


/* ── Project Card Mouse-Tracking Glow ── */
document.querySelectorAll('.pc').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
    c.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
});


/* ── Scroll Reveal ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('v');
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.sr,.srl').forEach(el => obs.observe(el));


/* ── Smooth Anchor Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});


/* ── Typewriter Eyebrow ── */
const ey = document.getElementById('eyebrow-txt');
if (ey) {
  const txt = ey.textContent;
  ey.textContent = '';
  let i = 0;
  function type() {
    if (i < txt.length) { ey.textContent += txt[i++]; setTimeout(type, 38); }
  }
  setTimeout(type, 900);
}


/* ── Featured Project Grid Fix ── */
function fixFeat() {
  const pf = document.getElementById('pf');
  if (!pf) return;

  if (window.innerWidth < 1024) {
    pf.style.gridColumn = 'span 1';
    const fi = pf.querySelector('.fi-inner');
    if (fi) fi.style.gridTemplateColumns = '1fr';
  } else {
    pf.style.gridColumn = 'span 2';
    const fi = pf.querySelector('.fi-inner');
    if (fi) fi.style.gridTemplateColumns = '1fr 1fr';
  }
}

window.addEventListener('resize', fixFeat);
fixFeat();
