/**
 * filter.js — client-side filtering for hero detail pages.
 * Reads window.__HERO_CARDS__ (injected by the static generator)
 * and filters .card-row elements without any page reload.
 */

(function () {
  'use strict';

  const cards = window.__HERO_CARDS__;
  const totalDecks = window.__TOTAL_DECKS__;
  if (!cards || !totalDecks) return;

  const rows = Array.from(document.querySelectorAll('.card-row'));
  const filterType = document.getElementById('filter-type');
  const filterFaction = document.getElementById('filter-faction');
  const filterCost = document.getElementById('filter-cost');
  const filterReset = document.getElementById('filter-reset');
  const resultCount = document.getElementById('result-count');

  function applyFilters() {
    const type = filterType.value;
    const faction = filterFaction.value;
    const cost = filterCost.value;

    let visible = 0;
    rows.forEach((row) => {
      const matchType = !type || row.dataset.type === type;
      const matchFaction = !faction || row.dataset.faction === faction;
      const matchCost = !cost || row.dataset.cost === cost;

      const show = matchType && matchFaction && matchCost;
      row.classList.toggle('hidden', !show);
      if (show) visible++;
    });

    resultCount.textContent = visible === rows.length
      ? `${rows.length} cards`
      : `${visible} / ${rows.length} cards`;
  }

  filterType.addEventListener('change', applyFilters);
  filterFaction.addEventListener('change', applyFilters);
  filterCost.addEventListener('change', applyFilters);

  filterReset.addEventListener('click', function () {
    filterType.value = '';
    filterFaction.value = '';
    filterCost.value = '';
    applyFilters();
  });

  // Initial count
  applyFilters();
})();
