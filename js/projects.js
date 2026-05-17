/* ================================================================
   js/projects.js — Project data + card/filter/modal logic
   Used only by projects.html.
   ================================================================ */

/* ==================================================================
   ★  IMAGE CONFIGURATION  ★
   This is the only section you need to touch to swap out images.

   HOW TO USE:
   - Put your image files in the  images/  folder.
   - Update the paths below to match your filenames.

   THUMBNAIL (thumb):
     One image path shown on the project card grid.
     Set to null to show the coloured emoji placeholder instead.

   MODAL IMAGES (images array):
     One OR MORE image paths shown in the lightbox popup carousel.
     - Single image  → no arrows shown, just the image (full view, no crop)
     - Multiple      → left/right arrows + dot indicators appear automatically
     Set to an empty array [] to show the coloured emoji placeholder instead.

   EXAMPLE with multiple images:
     1: {
       thumb:  'images/aurum-thumb.jpg',
       images: ['images/aurum-1.jpg', 'images/aurum-2.jpg', 'images/aurum-3.jpg'],
     },

   EXAMPLE with a single image (same file for both slots):
     2: {
       thumb:  'images/vela-thumb.jpg',
       images: ['images/vela-full.jpg'],
     },
================================================================== */
const projectImages = {
  //  id : { thumb, images[] }
  1:  { thumb: "images/original/Iris Flower.jpg", images: ["images/original/Iris Flower.jpg"] },   //Original Art 1
  2:  { thumb: "images/logos/Logo CMG White BG.jpg", images: ["images/logos/Logo CMG White.svg", "images/logos/Logo CMG.svg"] },   // CMG Logo
  3:  { thumb: "images/sports/Howell Vs Hartland Girls.jpg", images: ["images/sports/Howell Vs Hartland Girls.jpg", "images/sports/Barnyard Invitational Guys.jpg", "images/sports/SpotifyBlend_MeetDayV2.jpg"] },   // Forma App UI
  4:  { thumb: null, images: [] },   // Nōme Skincare Launch
  5:  { thumb: null, images: [] },   // Solstice Festival Poster Series
  6:  { thumb: null, images: [] },   // Pulse Fitness App
  7:  { thumb: null, images: [] },   // Anthropica Title Sequence
  8:  { thumb: null, images: [] },   // Koto Chocolate Packaging
};

/* ------------------------------------------------------------------
   PROJECT DATA
   To add, remove, or edit projects modify the objects below.
   You do NOT need to touch this section just to swap images —
   use projectImages above for that.

   Fields:
     id       — unique number (must match a key in projectImages)
     title    — project name shown on the card
     category — used by the filter bar (must match exactly)
     desc     — short summary shown on the card
     detail   — full paragraph shown in the lightbox modal
     tags     — array of tool/discipline tags for the modal
     color    — fallback background colour when no image is set
     icon     — fallback emoji when no image is set
------------------------------------------------------------------ */
const projects = [
  {
    id: 1,
    title:    'Original Piece: Iris Flower',
    category: 'Original Art',
    desc:     'A creative piece made in my free time, created in photoshop as practice.',
    detail:   'Created in Photoshop, constrained to a set color palette, in order to challenge imagination and creative expression.',
    tags:     ['Art', 'Digital Design', 'Original'],
    color:    '#292949',
    icon:     'Iris Flower',
  },
  {
    id: 2,
    title:    'CMG Socials Logo',
    category: 'Logo Design',
    desc:     'While it may be my own, it still counts!',
    detail:   'The very first logo I ever designed was my own of course! Using AI (Adobe Illustrator).',
    tags:     ['Logo Design', 'Branding'],
    color:    '#414141',
    icon:     'CMG Socials Logo',
  },
  {
    id: 3,
    title:    'Sports Graphics',
    category: 'Sports Design',
    desc:     'A small collection of graphics I have made for my high school sports teams.',
    detail:   'I have made a variety of graphics for my high school sports teams, including posters and social media graphics. These were all created in Photoshop.',
    tags:     ['Sports Design', 'Photoshop'],
    color:    '#1E5128',
    icon:     'Sports Graphics',
  },
];

/* ------------------------------------------------------------------
   2. PROJECT RENDERING & CATEGORY FILTERS
------------------------------------------------------------------ */
let activeFilter = 'all';

function renderProjects(filter) {
  activeFilter = filter;

  const categories = ['all', ...new Set(projects.map(p => p.category))];

  document.getElementById('filterBar').innerHTML = categories
    .map(cat => `
      <button
        class="filter-btn ${cat === filter ? 'active' : ''}"
        onclick="renderProjects('${cat}')"
      >${cat === 'all' ? 'All Work' : cat}</button>
    `)
    .join('');

  const visible = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  document.getElementById('projectsGrid').innerHTML = visible
    .map(p => {
      const imgs = projectImages[p.id] || {};
      const thumbHtml = imgs.thumb
        ? `<img src="${imgs.thumb}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;display:block;" />`
        : `<div class="project-thumb-icon">${p.icon}</div>`;

      return `
        <div class="project-card" onclick="openModal(${p.id})">
          <div class="project-thumb" style="background:${p.color}">
            ${thumbHtml}
          </div>
          <div class="project-info">
            <div class="project-category">${p.category}</div>
            <div class="project-title">${p.title}</div>
            <p class="project-desc">${p.desc}</p>
          </div>
        </div>
      `;
    })
    .join('');
}

/* ------------------------------------------------------------------
   3. CAROUSEL STATE
   Tracks which image is active inside the open modal.
------------------------------------------------------------------ */
let _carouselImages = [];
let _carouselIndex  = 0;

function carouselGo(direction) {
  const len = _carouselImages.length;
  if (len < 2) return;
  _carouselIndex = (_carouselIndex + direction + len) % len;
  renderCarousel();
}

function carouselGoTo(index) {
  _carouselIndex = index;
  renderCarousel();
}

function renderCarousel() {
  const track = document.getElementById('carouselTrack');
  const dots   = document.getElementById('carouselDots');
  if (!track) return;

  const src = _carouselImages[_carouselIndex];
  track.innerHTML = `
    <img
      src="${src}"
      alt="Project image ${_carouselIndex + 1} of ${_carouselImages.length}"
      class="carousel-img"
    />
  `;

  if (dots) {
    dots.innerHTML = _carouselImages
      .map((_, i) => `
        <button
          class="carousel-dot ${i === _carouselIndex ? 'active' : ''}"
          onclick="carouselGoTo(${i})"
          aria-label="Go to image ${i + 1}"
        ></button>
      `)
      .join('');
  }

  // Show/hide arrows based on whether there are multiple images
  const prev = document.getElementById('carouselPrev');
  const next = document.getElementById('carouselNext');
  const showArrows = _carouselImages.length > 1;
  if (prev) prev.style.display = showArrows ? 'flex' : 'none';
  if (next) next.style.display = showArrows ? 'flex' : 'none';
  if (dots) dots.style.display = showArrows ? 'flex' : 'none';
}

/* ------------------------------------------------------------------
   4. LIGHTBOX MODAL
------------------------------------------------------------------ */
function openModal(id) {
  const p       = projects.find(x => x.id === id);
  const imgs    = projectImages[p.id] || {};
  const imageList = (imgs.images && imgs.images.length > 0) ? imgs.images : [];

  _carouselImages = imageList;
  _carouselIndex  = 0;

  const overlay = document.getElementById('modalOverlay');
  const header  = document.getElementById('modalHeader');
  const body    = document.getElementById('modalBody');

  header.style.background = p.color;

  if (imageList.length > 0) {
    // Carousel / single image view — object-fit: contain shows the full image
    header.innerHTML = `
      <div class="carousel">
        <div class="carousel-track" id="carouselTrack"></div>

        <button class="carousel-arrow" id="carouselPrev" onclick="carouselGo(-1)" aria-label="Previous image">&#8592;</button>
        <button class="carousel-arrow carousel-arrow-right" id="carouselNext" onclick="carouselGo(1)" aria-label="Next image">&#8594;</button>

        <div class="carousel-dots" id="carouselDots"></div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    `;
    renderCarousel();
  } else {
    // No images — show emoji fallback
    header.innerHTML = `
      <span style="font-size:4rem">${p.icon}</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    `;
  }

  body.innerHTML = `
    <div class="project-category" style="margin-bottom:0.8rem">${p.category}</div>
    <h2>${p.title}</h2>
    <p>${p.detail}</p>
    <div class="modal-tags">
      ${p.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(event) {
  if (event && event.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Arrow-key navigation for the carousel while modal is open
document.addEventListener('keydown', e => {
  const open = document.getElementById('modalOverlay').classList.contains('open');
  if (e.key === 'Escape') {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
  if (open && e.key === 'ArrowLeft')  carouselGo(-1);
  if (open && e.key === 'ArrowRight') carouselGo(1);
});

document.addEventListener('DOMContentLoaded', () => renderProjects('all'));
