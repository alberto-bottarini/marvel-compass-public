(function () {
  'use strict';

  const grid = document.querySelector('.hero-grid');
  if (!grid) return;

  const btnDecks = document.getElementById('sort-decks');
  const btnName = document.getElementById('sort-name');
  const STORAGE_KEY = 'hero-sort';

  function sortBy(mode) {
    const cards = Array.from(grid.querySelectorAll('.hero-card'));
    cards.sort(function (a, b) {
      if (mode === 'name') {
        return a.dataset.name.localeCompare(b.dataset.name);
      }
      return Number(b.dataset.decks) - Number(a.dataset.decks);
    });
    cards.forEach(function (c) { grid.appendChild(c); });
    btnDecks.classList.toggle('sort-btn--active', mode === 'decks');
    btnName.classList.toggle('sort-btn--active', mode === 'name');
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (_) {}
  }

  btnDecks.addEventListener('click', function () { sortBy('decks'); });
  btnName.addEventListener('click', function () { sortBy('name'); });

  var saved;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}
  sortBy(saved === 'name' ? 'name' : 'decks');
})();
