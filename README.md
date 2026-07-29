# Kwame Mensah — Cinematic Personal Brand Landing Page

**GA Istovia Demo — Concept Project**
*A fictional personal-brand website built to showcase premium, award-grade interactive storytelling. "Kwame Mensah," his companies, clients and quotes are fictional and created for demonstration purposes only.*

---

## Project Name
**Kwame Mensah — Product Strategist & Design Systems Architect**

## Industry
Personal Branding / Executive Portfolio (Technology & Product Leadership)

## Short Description
A dark-mode, cinematic single-page experience that tells one African professional's career as a ten-chapter documentary rather than a conventional résumé site. Built for recruiters, founders, investors and executive audiences who need to trust someone within seconds of landing on the page.

## Creative Concept
- **Signature element:** a glowing "reel spine" runs the full height of the page, filling with an emerald-to-gold gradient as the visitor scrolls — visually tying every chapter together like a film reel.
- **Documentary framing:** a fixed REC indicator, a live timecode counter, and numbered "chapter markers" (Ch.01–Ch.10) reinforce the idea that the visitor is watching a story unfold, not browsing a static page.
- **Color system:** Obsidian, Graphite, Ash (near-black neutrals) with Signal Emerald and Harmattan Gold as dual accents, and warm Linen typography — deliberately avoiding a single neon-accent cliché.
- **Type system:** Fraunces (editorial serif display) paired with Inter (body) and IBM Plex Mono (chapter numbers, timecodes, data labels).
- **Photography:** a single consistent model across every section (business, casual, travel, portrait) for narrative continuity, sourced from royalty-free editorial stock.

## Structure (Ten Chapters)
01. Introduction — cinematic hero
02. Who Am I — mindset & mission
03. The Journey — animated timeline (2016–2025)
04. Expertise — four core disciplines
05. Achievements — animated statistics over a full-bleed portrait
06. Process — five-stage working method
07. Featured Projects — three flagship case studies
08. Testimonials — auto-rotating glassmorphic quotes
09. Why Hire Me — persuasive close with trust indicators
10. Contact — email, LinkedIn, GitHub, CV, schedule-a-call

## Features
- Custom loading sequence with a live "loading reel" progress readout
- Fixed REC indicator, scroll-mapped timecode, and top scroll-progress bar
- Cursor-reactive ambient glow (desktop, pointer-fine only)
- Scroll-reveal animations on every section via IntersectionObserver
- Magnetic buttons and 3D tilt cards on hover
- Parallax imagery on key chapters
- Animated counters for achievement statistics
- Auto-rotating testimonial carousel with manual dot navigation
- Fully responsive: desktop, tablet, mobile (custom mobile menu)
- `prefers-reduced-motion` respected throughout; all decorative motion disabled automatically
- Semantic HTML5, Schema.org `Person` structured data, Open Graph & Twitter Card tags, descriptive alt text on every image

## Technologies Used
- HTML5 (semantic structure, JSON-LD schema)
- Modern CSS3 (custom properties, CSS Grid/Flexbox, clamp()-based fluid type, no framework)
- Vanilla JavaScript (loader, scroll chrome, reveal system, carousel, counters)
- GSAP + ScrollTrigger (progressive enhancement only — page fully functional without it)
- Google Fonts: Fraunces, Inter, IBM Plex Mono

## File Structure
```
kwame-mensah-portfolio/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── images/        (reserved for local asset export)
│   └── icons/          (reserved for local asset export)
└── README.md
```

## Notes for Production Handoff
- Replace stock photography with a licensed shoot of the real subject for a live launch.
- Wire the "Schedule a Call" and "Download CV" buttons to a real Calendly link and a hosted PDF.
- Replace placeholder social/email links with verified live accounts before publishing.
