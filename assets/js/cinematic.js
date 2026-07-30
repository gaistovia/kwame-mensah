/* ==========================================================================
   PHASE 2 — CINEMATIC ENHANCEMENT LAYER (JS)
   Loads after main.js. Everything here is additive: it injects new
   decorative DOM (ambient background, cursor, avatars, particles) and
   attaches new behaviour to the EXISTING markup from main.js/style.css.
   No content, copy, or section structure is altered.
   Every module guards for prefers-reduced-motion and missing dependencies.
   ========================================================================== */

(function(){
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  if(hasGSAP && window.ScrollTrigger){ gsap.registerPlugin(ScrollTrigger); }

  /* ---------------------------------------------------------------
     1. Lenis smooth scroll (progressive enhancement)
  --------------------------------------------------------------- */
  let lenis = null;
  if(!reduceMotion && typeof window.Lenis !== 'undefined'){
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, lerp: 0.11 });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if(hasGSAP && window.ScrollTrigger){
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time*1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------------------------------------------------------------
     2. Ambient living background
  --------------------------------------------------------------- */
  (function ambientBackground(){
    const wrap = document.createElement('div');
    wrap.className = 'ambient-bg';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML =
      '<div class="ambient-blob b1"></div>' +
      '<div class="ambient-blob b2"></div>' +
      '<div class="ambient-blob b3"></div>' +
      '<div class="ambient-stars" id="ambientStars"></div>' +
      '<div class="ambient-noise"></div>';
    document.body.prepend(wrap);

    if(!reduceMotion){
      const starLayer = wrap.querySelector('#ambientStars');
      const count = window.innerWidth < 720 ? 26 : 60;
      for(let i=0;i<count;i++){
        const s = document.createElement('span');
        s.className = 'ambient-star';
        s.style.left = Math.random()*100 + '%';
        s.style.top = Math.random()*100 + '%';
        s.style.animationDuration = (2.5 + Math.random()*4) + 's';
        s.style.animationDelay = '-' + (Math.random()*5) + 's';
        starLayer.appendChild(s);
      }
    }
  })();

  /* ---------------------------------------------------------------
     3. Hero atmosphere: rays, grain, glass sweep, blur-to-focus wake
  --------------------------------------------------------------- */
  (function heroAtmosphere(){
    const heroBg = document.querySelector('.hero-bg');
    const heroImg = document.getElementById('heroImg');
    if(!heroBg) return;
    const rays = document.createElement('div'); rays.className = 'hero-rays'; rays.setAttribute('aria-hidden','true');
    const noise = document.createElement('div'); noise.className = 'hero-noise'; noise.setAttribute('aria-hidden','true');
    const sweep = document.createElement('div'); sweep.className = 'hero-glass-sweep'; sweep.setAttribute('aria-hidden','true');
    heroBg.appendChild(rays);
    heroBg.appendChild(noise);
    heroBg.appendChild(sweep);
    if(heroImg && !reduceMotion) heroImg.classList.add('cinematic-wake');
  })();

  /* ---------------------------------------------------------------
     4. Custom cursor — morphing dot + ring, context-aware
  --------------------------------------------------------------- */
  (function customCursor(){
    const cursor = document.getElementById('customCursor');
    const label = document.getElementById('cursorRingLabel');
    if(!cursor || reduceMotion || !finePointer) return;
    document.documentElement.classList.add('has-custom-cursor');

    let mx=0, my=0, rx=0, ry=0, dx=0, dy=0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.classList.add('is-visible');
    });
    window.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));

    (function loop(){
      dx += (mx-dx)*0.55; dy += (my-dy)*0.55; // dot: snappy
      rx += (mx-rx)*0.16; ry += (my-ry)*0.16; // ring: lagging
      cursor.style.transform = `translate(${dx}px, ${dy}px)`;
      const ring = cursor.querySelector('.cursor-ring');
      if(ring) ring.style.transform = `translate(${rx-dx}px, ${ry-dy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();

    const viewTargets = document.querySelectorAll('.project-card, .testimonial-card');
    const linkTargets = document.querySelectorAll('.magnetic, .nav-links a, .contact-link, .nav-logo');

    viewTargets.forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('state-view'); if(label) label.textContent = el.classList.contains('project-card') ? 'View' : 'Read'; });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('state-view'); });
    });
    linkTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('state-link'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('state-link'));
    });
  })();

  /* ---------------------------------------------------------------
     5. Loader — particle assembly + curtain wipe (syncs with main.js)
  --------------------------------------------------------------- */
  (function loaderCinematics(){
    const particlesWrap = document.getElementById('loaderParticles');
    const loaderEl = document.getElementById('loader');
    if(particlesWrap && !reduceMotion){
      for(let i=0;i<22;i++){
        const p = document.createElement('span');
        const angle = Math.random()*Math.PI*2;
        const dist = 80 + Math.random()*160;
        p.style.setProperty('--sx', Math.cos(angle)*dist + 'px');
        p.style.setProperty('--sy', Math.sin(angle)*dist + 'px');
        p.style.left = '50%'; p.style.top = '46%';
        p.style.animationDelay = (Math.random()*0.6) + 's';
        particlesWrap.appendChild(p);
      }
    }
    if(loaderEl){
      window.addEventListener('load', () => {
        setTimeout(() => loaderEl.classList.add('curtain-open'), 650);
      });
      setTimeout(() => loaderEl.classList.add('curtain-open'), 3200);
    }
  })();

  /* ---------------------------------------------------------------
     6. Text split reveal (words for headings, chars for hero lines)
  --------------------------------------------------------------- */
  function splitIntoWords(el){
    if(el.dataset.split) return;
    el.dataset.split = 'words';
    const text = el.textContent;
    el.textContent = '';
    text.split(/(\s+)/).forEach((chunk) => {
      if(chunk.trim() === ''){ el.appendChild(document.createTextNode(chunk)); return; }
      const outer = document.createElement('span'); outer.className = 'split-word';
      const inner = document.createElement('span'); inner.className = 'split-word-inner'; inner.textContent = chunk;
      outer.appendChild(inner);
      el.appendChild(outer);
    });
  }
  function splitIntoChars(el){
    if(el.dataset.split) return;
    el.dataset.split = 'chars';
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    text.split('').forEach((ch) => {
      const outer = document.createElement('span'); outer.className = 'split-char';
      const inner = document.createElement('span'); inner.className = 'split-char-inner';
      inner.textContent = ch === ' ' ? '\u00A0' : ch;
      inner.style.setProperty('--i', i);
      outer.appendChild(inner);
      el.appendChild(outer);
      i++;
    });
  }

  (function textSplitting(){
    document.querySelectorAll('.hero-headline .line').forEach(el => {
      if(!el.querySelector('em')) splitIntoChars(el);
    });
    document.querySelectorAll('.chapter-intro h2, .split-copy h2, .why-copy h2, .contact-inner h2, .ach-content h2').forEach(el => {
      splitIntoWords(el);
    });

    const splitTargets = document.querySelectorAll('[data-split]');
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add('split-ready', 'split-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      splitTargets.forEach(el => io.observe(el));
    } else {
      splitTargets.forEach(el => el.classList.add('split-ready','split-in'));
    }

    const heroHeadline = document.querySelector('.hero-headline');
    if(heroHeadline){ setTimeout(() => heroHeadline.classList.add('gradient-sheen'), 300); }
  })();

  /* ---------------------------------------------------------------
     7. Image reveal variants — assign data-reveal to known containers
  --------------------------------------------------------------- */
  (function imageReveals(){
    const map = [
      ['.split-visual .visual-frame', 'mask'],
      ['.ach-bg', 'blur'],
      ['.why-visual', 'rotate'],
      ['.projects-grid .project-card:nth-child(1) .project-media', 'sweep'],
      ['.projects-grid .project-card:nth-child(2) .project-media', 'mask'],
      ['.projects-grid .project-card:nth-child(3) .project-media', 'scale']
    ];
    const containers = [];
    map.forEach(([selector, type]) => {
      document.querySelectorAll(selector).forEach(el => {
        el.setAttribute('data-reveal', type);
        containers.push(el);
      });
    });
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      containers.forEach(el => io.observe(el));
    } else {
      containers.forEach(el => el.classList.add('revealed'));
    }
  })();

  /* ---------------------------------------------------------------
     8. Section-level cinematic entrance (one distinct treatment / chapter)
  --------------------------------------------------------------- */
  (function chapterEntrances(){
    const targets = document.querySelectorAll('.who, .journey, .expertise, .achievements, .process, .projects, .testimonials, .why, .contact');
    targets.forEach(el => el.classList.add('chapter-enter-target'));
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add('chapter-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
      targets.forEach(el => io.observe(el));
    } else {
      targets.forEach(el => el.classList.add('chapter-in'));
    }

    const contact = document.querySelector('.contact');
    if(contact){
      const bloom = document.createElement('div');
      bloom.className = 'contact-bloom'; bloom.setAttribute('aria-hidden','true');
      contact.prepend(bloom);
    }
  })();

  /* ---------------------------------------------------------------
     9. Magnetic button ripple on click
  --------------------------------------------------------------- */
  (function buttonRipple(){
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function(e){
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        const size = Math.max(rect.width, rect.height) * 1.6;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 750);
      });
    });
  })();

  /* ---------------------------------------------------------------
     10. Card cursor-follow sheen (--mx / --my custom properties)
  --------------------------------------------------------------- */
  (function cardSheen(){
    if(!finePointer) return;
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const b = card.getBoundingClientRect();
        const mx = ((e.clientX - b.left)/b.width)*100;
        const my = ((e.clientY - b.top)/b.height)*100;
        card.style.setProperty('--mx', mx + '%');
        card.style.setProperty('--my', my + '%');
      });
    });
  })();

  /* ---------------------------------------------------------------
     11. Timeline — scroll-linked fill line + node burst pulse
  --------------------------------------------------------------- */
  (function timelineFill(){
    const timeline = document.querySelector('.timeline');
    if(!timeline) return;
    const fill = document.createElement('span');
    fill.className = 'timeline-fill';
    timeline.appendChild(fill);

    function update(){
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const visibleTop = Math.min(Math.max(vh*0.75 - rect.top, 0), total);
      fill.style.height = (visibleTop/total*100) + '%';
    }
    window.addEventListener('scroll', update, { passive:true });
    window.addEventListener('resize', update);
    update();

    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            const dot = entry.target.querySelector('.timeline-dot');
            if(dot){ dot.classList.add('pulse'); }
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      timeline.querySelectorAll('.timeline-item').forEach(item => io.observe(item));
    }
  })();

  /* ---------------------------------------------------------------
     12. Stats — glow pulse + drawn underline + particle burst
  --------------------------------------------------------------- */
  (function statFlourish(){
    const stats = document.querySelectorAll('.stat');
    if(!stats.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const stat = entry.target;
          const numEl = stat.querySelector('.stat-num');
          if(numEl) numEl.classList.add('counting');

          if(!stat.querySelector('.stat-underline')){
            const underline = document.createElement('span');
            underline.className = 'stat-underline';
            stat.appendChild(underline);
          }
          if(!reduceMotion && numEl){
            const burstWrap = document.createElement('span');
            burstWrap.className = 'stat-burst';
            burstWrap.style.left = '0'; burstWrap.style.top = '-4px';
            for(let i=0;i<8;i++){
              const p = document.createElement('span');
              const angle = (Math.PI*2/8)*i + Math.random()*0.3;
              const dist = 26 + Math.random()*22;
              p.style.setProperty('--bx', Math.cos(angle)*dist + 'px');
              p.style.setProperty('--by', Math.sin(angle)*dist + 'px');
              p.style.animationDelay = (1.5 + Math.random()*0.2) + 's';
              burstWrap.appendChild(p);
            }
            numEl.style.position = 'relative';
            numEl.appendChild(burstWrap);
          }
          setTimeout(() => stat.classList.add('counted'), 1650);
          io.unobserve(stat);
        }
      });
    }, { threshold: 0.6 });
    stats.forEach(s => io.observe(s));
  })();

  /* ---------------------------------------------------------------
     13. Testimonials — monogram avatars from existing footer text
  --------------------------------------------------------------- */
  (function testimonialAvatars(){
    document.querySelectorAll('.testimonial-card').forEach(card => {
      if(card.querySelector('.testimonial-avatar')) return;
      const nameEl = card.querySelector('footer strong');
      if(!nameEl) return;
      const initials = nameEl.textContent.trim().split(/\s+/).map(w => w[0]).join('').slice(0,2).toUpperCase();
      const avatar = document.createElement('div');
      avatar.className = 'testimonial-avatar';
      avatar.textContent = initials;
      avatar.setAttribute('aria-hidden', 'true');
      card.insertBefore(avatar, card.firstChild);
    });
  })();

  /* ---------------------------------------------------------------
     14. Optional pin: let the achievements chapter breathe while
         the statistics resolve (skipped gracefully without GSAP)
  --------------------------------------------------------------- */
  if(hasGSAP && window.ScrollTrigger && !reduceMotion && window.innerWidth > 900){
    ScrollTrigger.create({
      trigger: '.achievements',
      start: 'top top',
      end: '+=45%',
      pin: true,
      pinSpacing: true
    });
  }

})();

/* ==========================================================================
   PHASE 3 — REFINEMENT PASS (JS)
   Wires up the audit fixes: hero spotlight/aurora + mouse parallax,
   per-section stagger indices for the new CSS reveal identities,
   cursor magnetism + click feedback, and extra background depth layers.
   Additive only — everything above in this file keeps working as-is.
   ========================================================================== */

(function(){
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;

  /* ---------------------------------------------------------------
     1. Hero: aurora + spotlight + mouse parallax layer
  --------------------------------------------------------------- */
  (function heroCinematicLayers(){
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');
    if(!hero || !heroBg) return;

    const aurora = document.createElement('div');
    aurora.className = 'hero-aurora'; aurora.setAttribute('aria-hidden','true');
    heroBg.appendChild(aurora);

    const spotlight = document.createElement('div');
    spotlight.className = 'hero-spotlight'; spotlight.setAttribute('aria-hidden','true');
    heroBg.appendChild(spotlight);
    heroBg.classList.add('hero-parallax-layer');

    if(reduceMotion || !finePointer) return;

    let active = false;
    hero.addEventListener('mouseenter', () => { active = true; spotlight.classList.add('is-active'); });
    hero.addEventListener('mouseleave', () => {
      active = false;
      spotlight.classList.remove('is-active');
      heroBg.style.transform = 'translate(0,0)';
    });
    hero.addEventListener('mousemove', (e) => {
      if(!active) return;
      const rect = hero.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      spotlight.style.setProperty('--sx', (px*100).toFixed(1) + '%');
      spotlight.style.setProperty('--sy', (py*100).toFixed(1) + '%');
      const offsetX = (px - 0.5) * 24; // gentle parallax range, image has enough bleed to cover it
      const offsetY = (py - 0.5) * 16;
      heroBg.style.transform = `translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px)`;
    });
  })();

  /* ---------------------------------------------------------------
     2. Extra background depth: fog vignette + light beams
  --------------------------------------------------------------- */
  (function extraBackgroundDepth(){
    const ambient = document.querySelector('.ambient-bg');
    if(!ambient) return;
    const fog = document.createElement('div'); fog.className = 'ambient-fog';
    const beam1 = document.createElement('div'); beam1.className = 'ambient-beam beam-1';
    const beam2 = document.createElement('div'); beam2.className = 'ambient-beam beam-2';
    ambient.appendChild(fog);
    ambient.appendChild(beam1);
    ambient.appendChild(beam2);
  })();

  /* ---------------------------------------------------------------
     3. Stagger indices for the new per-section CSS reveal identities
        (main.js already sets dataset.staggerIndex for its own timing;
        this exposes an equivalent as a real CSS custom property scoped
        per-container, so cards inside one grid stagger 0,1,2,3... rather
        than sharing main.js's global "% 6" pattern).
  --------------------------------------------------------------- */
  (function cssStaggerIndices(){
    const groups = [
      '.expertise-grid .expertise-card',
      '.stats-grid .stat',
      '.process-rail .process-step',
      '.projects-grid .project-card'
    ];
    groups.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, i) => {
        el.style.setProperty('--stagger-index', i);
      });
    });
  })();

  /* ---------------------------------------------------------------
     4. Cursor magnetism + click feedback (extends Phase 2 cursor)
  --------------------------------------------------------------- */
  (function cursorMagnetismAndClick(){
    const cursor = document.getElementById('customCursor');
    if(!cursor || reduceMotion || !finePointer) return;

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('state-snap'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('state-snap'));
    });

    window.addEventListener('mousedown', () => cursor.classList.add('is-clicking'));
    window.addEventListener('mouseup', () => cursor.classList.remove('is-clicking'));
  })();

  /* ---------------------------------------------------------------
     5. Pause expensive rAF-driven work when the tab is hidden
        (defensive; most browsers already throttle background rAF,
        this just avoids any needless recompute the instant it resumes)
  --------------------------------------------------------------- */
  let tabHidden = false;
  document.addEventListener('visibilitychange', () => { tabHidden = document.hidden; });
  window.__cinematicTabHidden = () => tabHidden;

})();
