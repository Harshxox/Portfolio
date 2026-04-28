// ===========================
//  HARSHDEEP SHARMA PORTFOLIO
//  Three.js 3D + Interactions
// ===========================

// ---- CURSOR ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});
function animateCursor() {
  fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a,button,.gallery-card,.timeline-card,.skill-category').forEach(el => {
  el.addEventListener('mouseenter', () => { follower.style.transform = 'translate(-50%,-50%) scale(1.8)'; follower.style.borderColor = 'rgba(124,58,237,.8)'; });
  el.addEventListener('mouseleave', () => { follower.style.transform = 'translate(-50%,-50%) scale(1)'; follower.style.borderColor = 'rgba(124,58,237,.5)'; });
});

// ---- THREE.JS SCENE ----
const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 30);

// --- PARTICLES ---
function createParticles(count, spread, size, color) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * spread;
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.7, sizeAttenuation: true });
  return new THREE.Points(geo, mat);
}
const p1 = createParticles(3000, 200, 0.15, 0x7c3aed);
const p2 = createParticles(1500, 150, 0.1, 0x06b6d4);
const p3 = createParticles(800, 120, 0.2, 0xf59e0b);
scene.add(p1, p2, p3);

// --- FLOATING GEOMETRIC SHAPES ---
function makeShape(geo, color, pos) {
  const mat = new THREE.MeshPhongMaterial({
    color, wireframe: true, transparent: true, opacity: 0.15
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...pos);
  mesh.userData.rotSpeed = { x: (Math.random() - 0.5) * 0.008, y: (Math.random() - 0.5) * 0.008 };
  mesh.userData.floatOffset = Math.random() * Math.PI * 2;
  scene.add(mesh);
  return mesh;
}
const shapes = [
  makeShape(new THREE.IcosahedronGeometry(3, 1), 0x7c3aed, [-20, 10, -10]),
  makeShape(new THREE.OctahedronGeometry(2.5, 0), 0x06b6d4, [22, -8, -15]),
  makeShape(new THREE.TorusGeometry(4, 0.8, 8, 20), 0xf59e0b, [15, 15, -20]),
  makeShape(new THREE.TetrahedronGeometry(2, 0), 0x7c3aed, [-18, -12, -10]),
  makeShape(new THREE.TorusKnotGeometry(2, 0.5, 64, 8), 0x06b6d4, [0, -20, -25]),
  makeShape(new THREE.DodecahedronGeometry(2, 0), 0xf59e0b, [-25, 5, -20]),
];

// --- DNA HELIX (connected points) ---
const helixGeo = new THREE.BufferGeometry();
const helixPts = [];
for (let i = 0; i < 200; i++) {
  const t = (i / 200) * Math.PI * 8;
  helixPts.push(Math.cos(t) * 2, i * 0.15 - 15, Math.sin(t) * 2);
  helixPts.push(Math.cos(t + Math.PI) * 2, i * 0.15 - 15, Math.sin(t + Math.PI) * 2);
}
helixGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(helixPts), 3));
const helixMat = new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.3 });
const helix = new THREE.Line(helixGeo, helixMat);
helix.position.set(-30, 0, -20);
scene.add(helix);

// --- GRID PLANE ---
const grid = new THREE.GridHelper(200, 40, 0x7c3aed, 0x0a0a1a);
grid.material.opacity = 0.06; grid.material.transparent = true;
grid.position.y = -25;
scene.add(grid);

// --- LIGHTS ---
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const light1 = new THREE.PointLight(0x7c3aed, 2, 100);
light1.position.set(-20, 20, 10);
scene.add(light1);
const light2 = new THREE.PointLight(0x06b6d4, 2, 100);
light2.position.set(20, -10, 10);
scene.add(light2);

// --- MOUSE TRACKING FOR 3D ---
let targetX = 0, targetY = 0, currX = 0, currY = 0;
document.addEventListener('mousemove', e => {
  targetX = (e.clientX / window.innerWidth - 0.5) * 2;
  targetY = (e.clientY / window.innerHeight - 0.5) * -2;
});

// ---- ANIMATE ----
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Smooth camera mouse follow + scroll depth
  currX += (targetX - currX) * 0.03;
  currY += (targetY - currY) * 0.03;
  camera.position.x = currX * 5;
  camera.position.y = currY * 3;
  // Scroll-driven Z depth
  const scrollZ = (window._scrollCamZ !== undefined) ? window._scrollCamZ : 30;
  camera.position.z += (scrollZ - camera.position.z) * 0.05;
  camera.lookAt(0, 0, 0);

  // Particle rotation
  p1.rotation.y = t * 0.03; p1.rotation.x = t * 0.01;
  p2.rotation.y = -t * 0.04; p2.rotation.z = t * 0.01;
  p3.rotation.x = t * 0.02;

  // Shape animations
  shapes.forEach((s, i) => {
    s.rotation.x += s.userData.rotSpeed.x;
    s.rotation.y += s.userData.rotSpeed.y;
    s.position.y += Math.sin(t * 0.5 + s.userData.floatOffset) * 0.008;
  });

  // DNA helix rotation
  helix.rotation.y = t * 0.2;

  // Pulse lights
  light1.intensity = 1.5 + Math.sin(t * 2) * 0.5;
  light2.intensity = 1.5 + Math.cos(t * 1.5) * 0.5;

  renderer.render(scene, camera);
}
animate();

// ---- RESIZE ----
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---- LOADER ----
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.style.cursor = 'none';
  }, 2400);
});

// ---- SCROLL REVEAL ----
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Animate skill bars when visible
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-section, .reveal-item').forEach(el => revealObs.observe(el));

// Also trigger skill bars from parent
document.querySelectorAll('.skill-bars').forEach(el => revealObs.observe(el));

// ---- NAV ACTIVE ----
const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const link = document.querySelector(`.nav-links a[data-nav="${e.target.id}"]`);
      if (link) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}, { rootMargin: "-40% 0px -40% 0px" });
document.querySelectorAll('.section[id]').forEach(s => navObs.observe(s));

// ---- MOBILE NAV ----
document.getElementById('navToggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// ---- TILT EFFECT ON GALLERY CARDS ----
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateY(-8px) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---- CONTACT FORM ----
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '<span>Sending... ⏳</span>';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<span>Sent! ✅</span>';
    document.getElementById('formSuccess').classList.add('show');
    document.getElementById('contactForm').reset();
    setTimeout(() => {
      btn.innerHTML = '<span>Send Message 🚀</span>';
      btn.disabled = false;
      document.getElementById('formSuccess').classList.remove('show');
    }, 4000);
  }, 1500);
});

// ---- HERO PHOTO PARALLAX ----
document.addEventListener('mousemove', e => {
  const photo = document.getElementById('heroPhoto');
  if (!photo) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 15;
  const y = (e.clientY / window.innerHeight - 0.5) * 15;
  photo.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
});

// ---- TYPED EFFECT ON HERO ----
const taglines = [
  "I don't just follow the AI wave — I help build it.",
  "AI Systems Builder. Leader. Innovator.",
  "Turning ideas into intelligent products.",
  "B.Tech CS (AI/ML) · L&T · Infosys · VBYLD 2026"
];
let tIdx = 0, cIdx = 0, typing = true;
const taglineEl = document.querySelector('.hero-tagline');
if (taglineEl) {
  taglineEl.innerHTML = '';
  function typeNext() {
    const txt = taglines[tIdx];
    if (typing) {
      taglineEl.innerHTML = txt.slice(0, cIdx + 1) + '<span class="caret">|</span>';
      cIdx++;
      if (cIdx === txt.length) { typing = false; setTimeout(typeNext, 1800); return; }
    } else {
      cIdx--;
      taglineEl.innerHTML = txt.slice(0, cIdx) + '<span class="caret">|</span>';
      if (cIdx === 0) { typing = true; tIdx = (tIdx + 1) % taglines.length; }
    }
    setTimeout(typeNext, typing ? 40 : 22);
  }
  setTimeout(typeNext, 2600);
}

// Add caret style
const caretStyle = document.createElement('style');
caretStyle.textContent = `.caret{animation:blink .7s infinite;color:#06b6d4;font-weight:300}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`;
document.head.appendChild(caretStyle);

// ---- NAV SCROLL STYLE ----
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 50
    ? 'rgba(5,5,16,0.95)'
    : 'rgba(5,5,16,0.7)';
});

// Mobile nav links close on click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// ====================================================
//  SCROLL-DRIVEN 3D EFFECTS
// ====================================================

(function () {
  // --- 1. SCROLL ? THREE.JS CAMERA Z DEPTH ---
  // As user scrolls down, camera slowly moves forward (zoom-in feel)
  let scrollTarget = 0, scrollCurrent = 0;
  const BASE_Z = 30;
  window.addEventListener('scroll', () => {
    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    scrollTarget = BASE_Z - progress * 18; // zoom from z=30 to z=12
  });

  // Patch into existing animate loop via requestAnimationFrame overlay
  function scrollAnimate() {
    scrollCurrent += (scrollTarget - scrollCurrent) * 0.04;
    // We only nudge Z without breaking mouse parallax � inject via global
    window._scrollCamZ = scrollCurrent;
    requestAnimationFrame(scrollAnimate);
  }
  scrollAnimate();

  // --- 2. SECTION DEPTH PARALLAX (CSS 3D layers) ---
  // Each section header title moves at different depth vs body on scroll
  const parallaxEls = document.querySelectorAll('.section-title, .hero-name');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    parallaxEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const vCenter = window.innerHeight / 2;
      const dist = (center - vCenter) / window.innerHeight;
      el.style.transform = `perspective(1200px) translateZ(${dist * -40}px) translateY(${dist * -12}px)`;
    });
  });

  // --- 3. CARD 3D ENTRANCE � rotate from depth on scroll ---
  const card3dObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('card-3d-in');
        card3dObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.journey-card, .project-card, .blog-card, .timeline-card, .edu-card, .now-card, .cert-card'
  ).forEach(el => {
    el.classList.add('card-3d-init');
    card3dObs.observe(el);
  });

  // --- 4. SCROLL SPEED ? PARTICLE WARP ---
  // On fast scroll, particles stretch and blur (warp drive feel)
  let lastScroll = 0, scrollVelocity = 0;
  window.addEventListener('scroll', () => {
    scrollVelocity = Math.abs(window.scrollY - lastScroll);
    lastScroll = window.scrollY;
    // Apply to canvas
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const warpOpacity = Math.min(0.12 + scrollVelocity * 0.004, 0.45);
    canvas.style.opacity = warpOpacity.toString();
    clearTimeout(window._warpTimer);
    window._warpTimer = setTimeout(() => {
      canvas.style.opacity = '1';
    }, 150);
  });

  // --- 5. SECTION BG DEPTH SHIFT (hue rotate on scroll depth) ---
  window.addEventListener('scroll', () => {
    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--scroll-hue', Math.round(progress * 30) + 'deg');
  });

  // --- 6. STAGGER TILT on project/blog/journey cards on scroll position ---
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.journey-card.card-3d-in, .project-card.card-3d-in').forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight * 1.2) return;
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const tilt = (progress - 0.5) * 4; // subtle tilt � 2deg
      // Only apply if not being mouse-hovered
      if (!card.matches(':hover')) {
        card.style.transform = `perspective(1000px) rotateX(${tilt}deg) translateY(${(progress - 0.5) * -6}px)`;
      }
    });
  });

  // --- 7. FLOATING 3D DEPTH LABELS (section progress glow dots) ---
  // Inject scroll progress indicator
  const progressRing = document.createElement('div');
  progressRing.id = 'scroll-progress';
  progressRing.innerHTML = `<svg viewBox="0 0 36 36" width="36" height="36">
    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(124,58,237,0.15)" stroke-width="2"/>
    <circle id="progress-circle" cx="18" cy="18" r="15.9" fill="none" stroke="url(#pg)" stroke-width="2"
      stroke-dasharray="0 100" stroke-linecap="round" transform="rotate(-90 18 18)"/>
    <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient></defs>
  </svg>`;
  document.body.appendChild(progressRing);

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    const circle = document.getElementById('progress-circle');
    if (circle) circle.setAttribute('stroke-dasharray', `${pct} 100`);
  });

})();

