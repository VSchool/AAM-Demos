/* ============================================================
   Space Explorer — W4 Example Capstone
   Vanilla JavaScript — no frameworks, no build tools
   ============================================================ */

// ---------- Configuration ----------
const API_BASE = 'https://api.nasa.gov/planetary/apod';
const API_KEY = 'DEMO_KEY';
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
const heroDateBadge = document.getElementById('hero-date-badge');
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

function formatDate(date) {
  return date.toISOString().split('T')[0];
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
  let url = `${API_BASE}?api_key=${API_KEY}`;
  if (date) {
    url += `&date=${date}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limit reached. The DEMO_KEY allows 30 requests per hour. Please wait a moment and try again.');
    }
    if (response.status === 404) {
      throw new Error('No image found for this date. Try a different date.');
    }
    throw new Error(`NASA API returned an error (${response.status}). Please try again later.`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'Unknown API error');
  }

  return data;
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
function renderHero(data) {
  heroDateBadge.textContent = data.date;
  heroTitle.textContent = data.title;
  heroCopyright.textContent = data.copyright ? `Credit: ${data.copyright}` : '';
  heroExplanation.textContent = data.explanation;

  // Clear and rebuild image area using safe DOM methods
  while (heroImageWrapper.firstChild) {
    heroImageWrapper.removeChild(heroImageWrapper.firstChild);
  }

  const dateBadge = document.createElement('span');
  dateBadge.className = 'hero-date-badge';
  dateBadge.id = 'hero-date-badge';
  dateBadge.textContent = data.date;

  if (data.media_type === 'video') {
    const iframe = document.createElement('iframe');
    iframe.src = data.url;
    iframe.title = data.title;
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    heroImageWrapper.appendChild(iframe);
  } else {
    const img = document.createElement('img');
    img.src = data.url;
    img.alt = data.title;
    img.loading = 'eager';
    heroImageWrapper.appendChild(img);
  }
  heroImageWrapper.appendChild(dateBadge);

  // HD link
  if (data.hdurl) {
    heroHdLink.href = data.hdurl;
    heroHdLink.style.display = 'inline-flex';
  } else {
    heroHdLink.style.display = 'none';
  }

  // Favorite button state
  updateFavButton(heroFavBtn, data.date);
}

function renderBrowse(data) {
  browseTitle.textContent = data.title;
  browseExplanation.textContent = data.explanation;

  // Clear and rebuild image area using safe DOM methods
  while (browseImageWrapper.firstChild) {
    browseImageWrapper.removeChild(browseImageWrapper.firstChild);
  }

  if (data.media_type === 'video') {
    const iframe = document.createElement('iframe');
    iframe.src = data.url;
    iframe.title = data.title;
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    browseImageWrapper.appendChild(iframe);
  } else {
    const img = document.createElement('img');
    img.src = data.url;
    img.alt = data.title;
    img.loading = 'lazy';
    browseImageWrapper.appendChild(img);
  }

  // HD link
  if (data.hdurl) {
    browseHdLink.href = data.hdurl;
    browseHdLink.style.display = 'inline-flex';
  } else {
    browseHdLink.style.display = 'none';
  }

  // Favorite button state
  updateFavButton(browseFavBtn, data.date);
}

// ---------- Favorites ----------
function loadFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
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
      hdurl: data.hdurl || null
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

    if (fav.media_type === 'image') {
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
