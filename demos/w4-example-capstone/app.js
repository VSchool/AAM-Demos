/* ============================================================
   Space Explorer — W4 Example Capstone
   Vanilla JavaScript — no frameworks, no build tools
   ============================================================ */

// ---------- Configuration ----------
// NASA's Astronomy Picture of the Day. No API key needed.
//   Latest picture:   GET {API_BASE}?per_page=1   (returns a list)
//   A specific day:   GET {API_BASE}/YYMMDD       (returns one object)
const API_BASE = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic';
const FAVORITES_KEY = 'space-explorer-favorites';

// ---------- State ----------
let favorites = loadFavorites();
let currentHeroData = null;
let currentBrowseData = null;

// ---------- DOM References ----------
const heroSpinner = document.getElementById('hero-spinner');
const heroError = document.getElementById('hero-error');
const heroCard = document.getElementById('hero-card');
const heroImageWrapper = document.getElementById('hero-image-wrapper');
const heroTitle = document.getElementById('hero-title');
const heroCopyright = document.getElementById('hero-copyright');
const heroExplanation = document.getElementById('hero-explanation');
const heroFavBtn = document.getElementById('hero-fav-btn');
const heroHdLink = document.getElementById('hero-hd-link');

const datePicker = document.getElementById('date-picker');
const browseBtn = document.getElementById('browse-btn');
const browseSpinner = document.getElementById('browse-spinner');
const browseError = document.getElementById('browse-error');
const browseResult = document.getElementById('browse-result');
const browseImageWrapper = document.getElementById('browse-image-wrapper');
const browseTitle = document.getElementById('browse-title');
const browseExplanation = document.getElementById('browse-explanation');
const browseFavBtn = document.getElementById('browse-fav-btn');
const browseHdLink = document.getElementById('browse-hd-link');

const favoritesGrid = document.getElementById('favorites-grid');
const favoritesEmpty = document.getElementById('favorites-empty');
const clearFavsBtn = document.getElementById('clear-favs-btn');
const favCountBadge = document.getElementById('fav-count');

const viewTabs = document.querySelectorAll('.view-tab');
const viewPanels = document.querySelectorAll('.view-panel');

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  setMaxDate();
  fetchTodaysAPOD();
  renderFavorites();
  updateFavCount();
  setupViewTabs();
  setupKeyboardNav();
});

// ---------- View Tabs ----------
function setupViewTabs() {
  // All tab-like buttons (view tabs + nav links)
  const allTabButtons = document.querySelectorAll('[data-tab]');
  const navLinks = document.querySelectorAll('.site-nav .nav-link[data-tab]');

  allTabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Deactivate all tab buttons and panels
      allTabButtons.forEach(t => t.classList.remove('active'));
      viewPanels.forEach(p => p.classList.remove('active'));

      // Activate matching buttons in both nav and view-tabs
      allTabButtons.forEach(t => {
        if (t.dataset.tab === target) {
          t.classList.add('active');
          // Update ARIA for role=tab elements
          if (t.getAttribute('role') === 'tab') {
            t.setAttribute('aria-selected', 'true');
          }
        } else if (t.getAttribute('role') === 'tab') {
          t.setAttribute('aria-selected', 'false');
        }
      });

      // Show target panel
      const panel = document.getElementById(`panel-${target}`);
      if (panel) {
        panel.classList.add('active');
      }
    });
  });
}

// ---------- Date Picker ----------
function setMaxDate() {
  const today = new Date();
  datePicker.max = formatDate(today);
  // NASA APOD starts on June 16, 1995
  datePicker.min = '1995-06-16';
}

// YYYY-MM-DD in the visitor's own time zone. (toISOString() uses UTC,
// which is already "tomorrow" on a US evening.)
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Browse button click
browseBtn.addEventListener('click', () => {
  const selectedDate = datePicker.value;
  if (!selectedDate) {
    datePicker.focus();
    return;
  }
  fetchAPOD(selectedDate, 'browse');
});

// Also fetch on Enter key in date picker
datePicker.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    browseBtn.click();
  }
});

// ---------- API Fetching ----------
async function fetchTodaysAPOD() {
  showState('hero', 'loading');
  try {
    const data = await fetchAPODData();
    currentHeroData = data;
    renderHero(data);
    showState('hero', 'success');
  } catch (err) {
    console.error('Failed to fetch today\'s APOD:', err);
    showState('hero', 'error', err.message);
  }
}

async function fetchAPOD(date, target) {
  if (target === 'browse') {
    showState('browse', 'loading');
    try {
      const data = await fetchAPODData(date);
      currentBrowseData = data;
      renderBrowse(data);
      showState('browse', 'success');
    } catch (err) {
      console.error(`Failed to fetch APOD for ${date}:`, err);
      showState('browse', 'error', err.message);
    }
  }
}

async function fetchAPODData(date) {
  // "2026-09-05" becomes "260905", the format this endpoint expects
  const url = date
    ? `${API_BASE}/${date.slice(2).replaceAll('-', '')}`
    : `${API_BASE}?per_page=1`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('No image found for this date. Try a different date.');
    }
    if (response.status === 400) {
      throw new Error('That date doesn\'t look right. Pick one from the calendar.');
    }
    if (response.status === 429) {
      throw new Error('Too many requests to NASA right now. Wait a moment and try again.');
    }
    throw new Error(`NASA API returned an error (${response.status}). Please try again later.`);
  }

  const json = await response.json();
  // The "latest" call returns a list; a specific date returns one object
  const raw = Array.isArray(json) ? json[0] : json;

  return transformAPOD(raw);
}

// ---------- Data Transformation ----------
// NASA's data isn't shaped the way this page needs it, so reshape it once,
// here, and let the rest of the app work with clean fields.
function transformAPOD(raw) {
  // Unexpected data should show an error, not a half-empty card
  if (!raw || !raw.date || !raw.title) {
    throw new Error('NASA sent back data we didn\'t expect. Please try again later.');
  }

  return {
    date: raw.date,
    title: htmlToText(raw.title),
    // NASA's text includes links, a leading "Explanation:" label, and extras
    // after a double line break (like "Tomorrow's picture: ..."). Keep the
    // main explanation only.
    explanation: htmlToText((raw.explanation || '').split(/<br\s*\/?>\s*<br\s*\/?>/i)[0])
      .replace(/^Explanation:\s*/, ''),
    copyright: htmlToText(raw.copyright || raw.credit || ''),
    media_type: raw.media_type,
    // The picture itself. On video days this is a still frame from the video.
    url: raw.hdurl || null,
    alt: htmlToText(raw.alt || raw.title),
    // NASA's own page for this day (where the video plays on video days)
    pageUrl: raw.permalink || raw.url
  };
}

// Turn an HTML string into plain text. DOMParser never runs scripts,
// and we only ever display the result with textContent.
function htmlToText(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}

// ---------- State Management ----------
function showState(section, state, errorMsg) {
  if (section === 'hero') {
    heroSpinner.classList.toggle('visible', state === 'loading');
    heroError.classList.toggle('visible', state === 'error');
    heroCard.style.display = state === 'success' ? 'block' : 'none';
    if (state === 'error') {
      heroError.querySelector('p').textContent = errorMsg || 'Something went wrong.';
    }
  } else if (section === 'browse') {
    browseSpinner.classList.toggle('visible', state === 'loading');
    browseError.classList.toggle('visible', state === 'error');
    browseResult.classList.toggle('visible', state === 'success');
    if (state === 'error') {
      browseError.querySelector('p').textContent = errorMsg || 'Something went wrong.';
    }
  }
}

// ---------- Rendering ----------
// Fill an image area with the day's picture. Videos can't play inside this
// page, so on video days we show a still frame, label it, and the
// "Watch on NASA" link takes the visitor to the video.
function renderMedia(wrapper, data, loading) {
  // Clear and rebuild the image area using safe DOM methods
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }

  if (data.url) {
    const img = document.createElement('img');
    img.src = data.url;
    img.alt = data.alt;
    img.loading = loading;
    wrapper.appendChild(img);
  } else {
    const placeholder = document.createElement('p');
    placeholder.className = 'media-placeholder';
    placeholder.textContent = 'No preview image for this day. Open it on NASA to see it.';
    wrapper.appendChild(placeholder);
  }

  if (data.media_type === 'video') {
    const videoBadge = document.createElement('span');
    videoBadge.className = 'hero-date-badge media-badge--video';
    videoBadge.textContent = '▶ Video';
    wrapper.appendChild(videoBadge);
  }
}

// Point the "View on NASA" button at NASA's page for this day
function updateNasaLink(link, data) {
  if (data.pageUrl) {
    link.href = data.pageUrl;
    link.textContent = data.media_type === 'video' ? 'Watch on NASA' : 'View on NASA';
    link.style.display = 'inline-flex';
  } else {
    link.style.display = 'none';
  }
}

function renderHero(data) {
  heroTitle.textContent = data.title;
  heroCopyright.textContent = data.copyright ? `Credit: ${data.copyright}` : '';
  heroExplanation.textContent = data.explanation;

  renderMedia(heroImageWrapper, data, 'eager');

  const dateBadge = document.createElement('span');
  dateBadge.className = 'hero-date-badge';
  dateBadge.textContent = data.date;
  heroImageWrapper.appendChild(dateBadge);

  updateNasaLink(heroHdLink, data);
  updateFavButton(heroFavBtn, data.date);
}

function renderBrowse(data) {
  browseTitle.textContent = data.title;
  browseExplanation.textContent = data.explanation;

  renderMedia(browseImageWrapper, data, 'lazy');

  updateNasaLink(browseHdLink, data);
  updateFavButton(browseFavBtn, data.date);
}

// ---------- Favorites ----------
function loadFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    const saved = stored ? JSON.parse(stored) : [];
    // While NASA was moving APOD to a new address (fall 2026), the old API
    // sent the NASA logo in place of every picture. Drop any favorites saved
    // from that placeholder data so visitors can re-save the real picture.
    return saved.filter(f => !(f.url || '').includes('nasa-logo'));
  } catch {
    return [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error('Failed to save favorites:', err);
  }
}

function isFavorited(date) {
  return favorites.some(f => f.date === date);
}

function toggleFavorite(data) {
  if (!data) return;

  if (isFavorited(data.date)) {
    favorites = favorites.filter(f => f.date !== data.date);
  } else {
    favorites.push({
      date: data.date,
      title: data.title,
      url: data.url,
      media_type: data.media_type,
      pageUrl: data.pageUrl || null
    });
  }

  saveFavorites();
  renderFavorites();
  updateFavCount();

  // Update both fav buttons in case same date appears in hero + browse
  updateFavButton(heroFavBtn, currentHeroData?.date);
  updateFavButton(browseFavBtn, currentBrowseData?.date);
}

function updateFavButton(btn, date) {
  if (!btn || !date) return;
  const faved = isFavorited(date);
  btn.classList.toggle('is-favorited', faved);
  btn.textContent = faved ? '\u2605 Favorited' : '\u2606 Add to Favorites';
  btn.setAttribute('aria-pressed', faved);
}

function updateFavCount() {
  favCountBadge.textContent = favorites.length;
  favCountBadge.style.display = favorites.length > 0 ? 'inline' : 'none';
}

function renderFavorites() {
  if (favorites.length === 0) {
    // Clear grid using safe DOM methods
    while (favoritesGrid.firstChild) {
      favoritesGrid.removeChild(favoritesGrid.firstChild);
    }
    favoritesEmpty.style.display = 'block';
    clearFavsBtn.style.display = 'none';
    return;
  }

  favoritesEmpty.style.display = 'none';
  clearFavsBtn.style.display = 'inline-flex';

  // Clear grid using safe DOM methods
  while (favoritesGrid.firstChild) {
    favoritesGrid.removeChild(favoritesGrid.firstChild);
  }

  // Render in reverse order (newest first) using safe DOM creation
  const sortedFavs = [...favorites].reverse();

  sortedFavs.forEach(fav => {
    const article = document.createElement('article');
    article.className = 'favorite-card';
    article.dataset.date = fav.date;

    // Video favorites saved before the API move hold a video link, not a
    // picture, so they get the play-icon placeholder instead
    const isPicture = fav.media_type === 'image' || (fav.url || '').startsWith('https://assets.science.nasa.gov/');
    if (fav.url && isPicture) {
      const img = document.createElement('img');
      img.className = 'favorite-card-image';
      img.src = fav.url;
      img.alt = fav.title;
      img.loading = 'lazy';
      article.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'favorite-card-image';
      placeholder.style.cssText = 'display:flex;align-items:center;justify-content:center;background:var(--bg-primary);color:var(--text-muted);font-size:var(--text-2xl);';
      placeholder.textContent = '\u25B6';
      article.appendChild(placeholder);
    }

    const body = document.createElement('div');
    body.className = 'favorite-card-body';

    const dateEl = document.createElement('p');
    dateEl.className = 'favorite-card-date';
    dateEl.textContent = fav.date;
    body.appendChild(dateEl);

    const titleEl = document.createElement('h3');
    titleEl.className = 'favorite-card-title';
    titleEl.textContent = fav.title;
    body.appendChild(titleEl);

    const actions = document.createElement('div');
    actions.className = 'favorite-card-actions';

    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn btn-secondary';
    viewBtn.textContent = 'View';
    viewBtn.setAttribute('aria-label', `View ${fav.title}`);
    viewBtn.addEventListener('click', () => loadFavorite(fav.date));
    actions.appendChild(viewBtn);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger';
    removeBtn.textContent = 'Remove';
    removeBtn.setAttribute('aria-label', `Remove ${fav.title} from favorites`);
    removeBtn.addEventListener('click', () => removeFavorite(fav.date));
    actions.appendChild(removeBtn);

    body.appendChild(actions);
    article.appendChild(body);
    favoritesGrid.appendChild(article);
  });
}

function removeFavorite(date) {
  favorites = favorites.filter(f => f.date !== date);
  saveFavorites();
  renderFavorites();
  updateFavCount();
  updateFavButton(heroFavBtn, currentHeroData?.date);
  updateFavButton(browseFavBtn, currentBrowseData?.date);
}

function loadFavorite(date) {
  // Switch to Browse tab and load the date
  datePicker.value = date;
  // Activate browse tab (deactivate all, then activate all browse-targeted buttons)
  const allTabButtons = document.querySelectorAll('[data-tab]');
  allTabButtons.forEach(t => t.classList.remove('active'));
  viewPanels.forEach(p => p.classList.remove('active'));
  document.querySelectorAll('[data-tab="browse"]').forEach(t => t.classList.add('active'));
  document.getElementById('panel-browse').classList.add('active');
  fetchAPOD(date, 'browse');
  // Scroll to browse section
  document.getElementById('panel-browse').scrollIntoView({ behavior: 'smooth' });
}

// Hero favorite button
heroFavBtn.addEventListener('click', () => {
  toggleFavorite(currentHeroData);
});

// Browse favorite button
browseFavBtn.addEventListener('click', () => {
  toggleFavorite(currentBrowseData);
});

// Clear all favorites
clearFavsBtn.addEventListener('click', () => {
  if (confirm('Remove all favorites? This cannot be undone.')) {
    favorites = [];
    saveFavorites();
    renderFavorites();
    updateFavCount();
    updateFavButton(heroFavBtn, currentHeroData?.date);
    updateFavButton(browseFavBtn, currentBrowseData?.date);
  }
});

// Hero retry button
document.getElementById('hero-retry-btn').addEventListener('click', () => {
  fetchTodaysAPOD();
});

// Browse retry button
document.getElementById('browse-retry-btn').addEventListener('click', () => {
  const selectedDate = datePicker.value;
  if (selectedDate) {
    fetchAPOD(selectedDate, 'browse');
  }
});

// ---------- Keyboard Navigation ----------
function setupKeyboardNav() {
  // Let Tab work naturally — focus states handled in CSS
  // Add keyboard support for closing focus
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.activeElement.blur();
    }
  });
}
