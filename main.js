/* ==========================================================================
   KWAME MENSAH — CINEMATIC PERSONAL BRAND — MAIN JS
   Vanilla-first, GSAP-enhanced. Every effect degrades gracefully if a
   dependency is unavailable (e.g. blocked CDN, reduced-motion).
   ========================================================================== */

(function(){
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  if(hasGSAP && window.ScrollTrigger){ gsap.registerPlugin(ScrollTrigger); }

  /* ---------------- Loader ---------------- */
  (function loader(){
    const loaderEl = document.getElementById('loader');
    const bar = document.getElementById('loaderProgress');
    const label = document.querySelector('.loader-label');
    let progress = 0;
    const tick = () => {
      progress += Math.random() * 18;
      if(progress > 100) progress = 100;
      if(bar) bar.style.width = progress + '%';
      if(label) label.textContent = 'LOADING REEL — ' + String(Math.floor(progress)).padStart(2,'0') + '%';
      if(progress < 100){
        requestAnimationFrame(() => setTimeout(tick, 90));
      } else {
        setTimeout(() => { if(loaderEl) loaderEl.classList.add('hide'); }, 250);
      }
    };
    tick();
    window.addEventListener('load', () => {
      setTimeout(() => { if(loaderEl) loaderEl.classList.add('hide'); }, 900);
    });
  })();

  /* ---------------- Year ---------------- */
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Nav scroll state ---------------- */
  const nav = document.getElementById('siteNav');
  const onScrollNav = () => {
    if(!nav) return;
    if(window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScrollNav, {passive:true});
  onScrollNav();

  /* ---------------- Mobile menu ---------------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  if(burger && mobileMenu){
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded','false');
      });
    });
  }

  /* ---------------- Scroll progress / timecode / reel spine ---------------- */
  const progressBar = document.getElementById('scrollProgressBar');
  const timecodeEl = document.getElementById('timecodeCurrent');
  const reelFill = document.getElementById('reelFill');
  const TOTAL_SECONDS = 9*60 + 40;

  function updateScrollChrome(){
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = (doc.scrollHeight - doc.clientHeight) || 1;
    const pct = Math.min(1, Math.max(0, scrollTop / scrollHeight));
    if(progressBar) progressBar.style.width = (pct*100) + '%';
    if(reelFill) reelFill.style.height = (pct*100) + '%';
    if(timecodeEl){
      const secs = Math.floor(pct * TOTAL_SECONDS);
      const m = Math.floor(secs/60).toString().padStart(2,'0');
      const s = Math.floor(secs%60).toString().padStart(2,'0');
      timecodeEl.textContent = m + ':' + s;
    }
  }
  window.addEventListener('scroll', updateScrollChrome, {passive:true});
  updateScrollChrome();

  /* ---------------- Cursor glow ---------------- */
  const glow = document.getElementById('cursorGlow');
  if(glow && !reduceMotion && window.matchMedia('(pointer:fine)').matches){
    let gx=0, gy=0, cx=0, cy=0;
    window.addEventListener('mousemove', e => { gx = e.clientX; gy = e.clientY; glow.style.opacity = 1; });
    window.addEventListener('mouseleave', () => { glow.style.opacity = 0; });
    (function animateGlow(){
      cx += (gx-cx)*0.12; cy += (gy-cy)*0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateGlow);
    })();
  } else if(glow){ glow.style.display = 'none'; }

  /* ---------------- Reveal on scroll ---------------- */
  const revealTargets = document.querySelectorAll('.reveal, .reveal-text, .timeline-item, .process-step');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if(entry.isIntersecting){
          const el = entry.target;
          const delay = el.dataset.staggerIndex ? Number(el.dataset.staggerIndex)*80 : 0;
          setTimeout(() => el.classList.add('in'), delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el, i) => {
      // stagger items that share a direct parent container
      el.dataset.staggerIndex = i % 6;
      io.observe(el);
    });
  } else {
    revealTargets.forEach(el => el.classList.add('in'));
  }

  /* ---------------- Chapter-aware timecode label swap (rec indicator context) ---------------- */
  const chapters = document.querySelectorAll('.chapter');
  if('IntersectionObserver' in window && chapters.length){
    const chapterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          document.title = 'Ch.' + entry.target.dataset.chapter + ' — ' + entry.target.dataset.chapterTitle + ' · Kwame Mensah';
        }
      });
    }, { threshold: 0.5 });
    chapters.forEach(ch => chapterIO.observe(ch));
  }

  /* ---------------- Magnetic buttons ---------------- */
  const magneticEls = document.querySelectorAll('.magnetic');
  if(!reduceMotion && window.matchMedia('(pointer:fine)').matches){
    magneticEls.forEach(el => {
      let bounds;
      el.addEventListener('mouseenter', () => { bounds = el.getBoundingClientRect(); });
      el.addEventListener('mousemove', (e) => {
        if(!bounds) bounds = el.getBoundingClientRect();
        const relX = e.clientX - bounds.left - bounds.width/2;
        const relY = e.clientY - bounds.top - bounds.height/2;
        el.style.transform = `translate(${relX*0.25}px, ${relY*0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------------- Tilt cards ---------------- */
  const tiltCards = document.querySelectorAll('.tilt-card');
  if(!reduceMotion && window.matchMedia('(pointer:fine)').matches){
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const b = card.getBoundingClientRect();
        const px = (e.clientX - b.left)/b.width - 0.5;
        const py = (e.clientY - b.top)/b.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-py*6).toFixed(2)}deg) rotateY(${(px*8).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ---------------- Parallax images ---------------- */
  const parallaxEls = document.querySelectorAll('.parallax-img');
  if(!reduceMotion){
    function updateParallax(){
      const vh = window.innerHeight;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed || '0.1');
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height/2 - vh/2;
        const img = el.querySelector('img') || el;
        img.style.transform = `translateY(${(-center*speed).toFixed(1)}px) scale(1.12)`;
      });
    }
    window.addEventListener('scroll', updateParallax, {passive:true});
    window.addEventListener('resize', updateParallax);
    updateParallax();
  }

  /* ---------------- Hero particles ---------------- */
  (function heroParticles(){
    const container = document.getElementById('heroParticles');
    if(!container || reduceMotion) return;
    const count = window.innerWidth < 720 ? 16 : 34;
    for(let i=0;i<count;i++){
      const p = document.createElement('span');
      const left = Math.random()*100;
      const duration = 10 + Math.random()*14;
      const delay = Math.random()*14;
      const size = 1.5 + Math.random()*2.5;
      p.style.left = left + '%';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.animationDuration = duration + 's';
      p.style.animationDelay = '-' + delay + 's';
      container.appendChild(p);
    }
  })();

  /* ---------------- Animated counters ---------------- */
  const stats = document.querySelectorAll('.stat-num');
  if('IntersectionObserver' in window && stats.length){
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          animateCounter(entry.target);
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    stats.forEach(s => statIO.observe(s));
  }
  function animateCounter(el){
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimal ? Number(el.dataset.decimal) : 0;
    const duration = 1600;
    const start = performance.now();
    function step(now){
      const t = Math.min(1, (now-start)/duration);
      const eased = 1 - Math.pow(1-t, 3);
      const value = target*eased;
      el.textContent = (decimals ? value.toFixed(decimals) : Math.floor(value)) + suffix;
      if(t < 1) requestAnimationFrame(step);
      else el.textContent = (decimals ? target.toFixed(decimals) : target) + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------------- Testimonial carousel ---------------- */
  (function testimonials(){
    const track = document.getElementById('testimonialTrack');
    if(!track) return;
    const cards = track.querySelectorAll('.testimonial-card');
    const dotsWrap = document.getElementById('testimonialDots');
    let active = 0;
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      if(i===0) dot.classList.add('active');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i+1));
      dot.addEventListener('click', () => setActive(i));
      dotsWrap.appendChild(dot);
    });
    function setActive(i){
      cards[active].classList.remove('active');
      dotsWrap.children[active].classList.remove('active');
      active = i;
      cards[active].classList.add('active');
      dotsWrap.children[active].classList.add('active');
    }
    setInterval(() => { setActive((active+1) % cards.length); }, 6000);
  })();

  /* ---------------- Hero image subtle GSAP entrance (progressive enhancement) ---------------- */
  if(hasGSAP && !reduceMotion){
    gsap.from('.hero-img', { scale: 1.22, duration: 2.2, ease: 'power2.out' });
    gsap.to('.hero-img', { scale: 1.0, duration: 18, ease: 'none' });
  }

})();
