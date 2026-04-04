/* =============================================================
   Pretty Everlasting – script.js
   ============================================================= */

/* ── BandsInTown config ───────────────────────────────────── */
const BANDSINTOWN_ARTIST = 'Pretty Everlasting';
const BANDSINTOWN_APP_ID = '3a517c40c6ce4c894fc4254e9c08a558';

// Kända tidigare spelningar – visas som fallback om API inte svarar
// eller om BandsInTown inte har historiska spelningar
const PAST_SHOWS_FALLBACK = [
  { datetime: '2024-02-10', venue: { name: 'Williams Pub',   city: 'Uppsala', country: 'Sverige' } },
  { datetime: '2023-12-05', venue: { name: 'Kalmar nation',  city: 'Uppsala', country: 'Sverige' } },
  { datetime: '2023-03-19', venue: { name: 'Kalmar nation',  city: 'Uppsala', country: 'Sverige' } },
  { datetime: '2021-11-20', venue: { name: 'Kalmar nation',  city: 'Uppsala', country: 'Sverige' } },
  { datetime: '2021-10-08', venue: { name: 'Kalmar nation',  city: 'Uppsala', country: 'Sverige' } },
  { datetime: '2021-08-14', venue: { name: 'Uplands nation', city: 'Uppsala', country: 'Sverige' } },
];

/* ── Sticky header ────────────────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ── Mobile nav toggle ────────────────────────────────────── */
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  function close() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close when a nav link is clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();

/* ── Back to top button ───────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
})();

/* ── BandsInTown shows ────────────────────────────────────── */
function formatShowDate(dateStr) {
  const date = new Date(dateStr);
  return {
    day:   date.toLocaleDateString('sv-SE', { day: '2-digit' }),
    month: date.toLocaleDateString('sv-SE', { month: 'short' }).replace('.', '').toUpperCase(),
    year:  date.getFullYear(),
  };
}

function showItemHTML(show, isPast) {
  const d = formatShowDate(show.datetime);
  const venue    = show.venue.name;
  const city     = show.venue.city;
  const country  = show.venue.country;
  const location = country === 'Sverige' || country === 'Sweden'
    ? city
    : `${city}, ${country}`;
  const ticketBtn = (!isPast && show.url)
    ? `<a href="${show.url}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">Biljetter</a>`
    : '';

  return `
    <div class="show-item${isPast ? ' show-past' : ''}">
      <div class="show-date-block">
        <span class="show-day">${d.day}</span>
        <span class="show-month">${d.month}</span>
        <span class="show-year">${d.year}</span>
      </div>
      <div class="show-details">
        <strong>${escapeHTML(venue)}</strong>
        <span>${escapeHTML(location)}</span>
      </div>
      ${ticketBtn}
    </div>`;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderShows(events) {
  const now      = new Date();
  const upcoming = events.filter(e => new Date(e.datetime) >= now);
  const past     = events.filter(e => new Date(e.datetime) < now)
                         .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

  // Upcoming
  const upcomingEl = document.getElementById('shows-upcoming-list');
  if (upcomingEl) {
    if (upcoming.length === 0) {
      upcomingEl.innerHTML = '<p class="shows-empty">Inga kommande spelningar just nu – håll utkik!</p>';
    } else {
      upcomingEl.innerHTML = upcoming.map(e => showItemHTML(e, false)).join('');
    }
  }

  // Past – prefer API data, fall back to hardcoded list
  const pastShows = past.length > 0 ? past : PAST_SHOWS_FALLBACK;
  renderPastShows(pastShows);
}

function renderPastShows(shows) {
  const pastEl = document.getElementById('shows-past-list');
  if (!pastEl) return;

  const visible = 4;
  const html    = shows.slice(0, visible).map(e => showItemHTML(e, true)).join('');

  if (shows.length > visible) {
    const remaining = shows.length - visible;
    const hiddenHTML = shows.slice(visible).map(e => showItemHTML(e, true)).join('');
    pastEl.innerHTML = html +
      `<div id="past-shows-extra" style="display:none">${hiddenHTML}</div>
       <button class="btn btn-ghost btn-sm show-more-btn" id="show-more-past">
         Visa fler (${remaining})
       </button>`;

    document.getElementById('show-more-past').addEventListener('click', function () {
      document.getElementById('past-shows-extra').style.display = '';
      this.remove();
    });
  } else {
    pastEl.innerHTML = html;
  }
}

function renderFallbackShows() {
  const upcomingEl = document.getElementById('shows-upcoming-list');
  if (upcomingEl) {
    upcomingEl.innerHTML = '<p class="shows-empty">Inga kommande spelningar just nu – håll utkik!</p>';
  }
  renderPastShows(PAST_SHOWS_FALLBACK);
}

async function fetchShows() {
  // Skip API call if placeholder app ID is still in place
  if (BANDSINTOWN_APP_ID === '3a517c40c6ce4c894fc4254e9c08a558') {
    renderFallbackShows();
    return;
  }

  try {
    const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(BANDSINTOWN_ARTIST)}/events?app_id=${encodeURIComponent(BANDSINTOWN_APP_ID)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // BandsInTown returns an error object instead of array when artist not found
    if (!Array.isArray(data)) throw new Error('Unexpected response');
    renderShows(data);
  } catch (err) {
    console.warn('BandsInTown API error:', err.message);
    renderFallbackShows();
  }
}

/* ── Contact form (Formspree async) ──────────────────────── */
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn    = document.getElementById('form-submit-btn');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled    = true;
    btn.textContent = 'Skickar...';
    status.textContent = '';
    status.className   = 'form-status';

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        status.textContent = 'Tack! Vi återkommer så snart vi kan.';
        status.className   = 'form-status success';
        form.reset();
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch {
      status.textContent = 'Något gick fel. Försök igen eller maila oss direkt.';
      status.className   = 'form-status error';
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Skicka';
    }
  });
})();

/* ── Copyright year ───────────────────────────────────────── */
(function setCopyrightYear() {
  const el = document.getElementById('copyright-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ── Init ─────────────────────────────────────────────────── */
fetchShows();
