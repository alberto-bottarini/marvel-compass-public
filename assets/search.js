(function () {
  'use strict';

  var input = document.getElementById('search-input');
  var dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  var lang = document.documentElement.lang || 'en';
  var index = null;
  var activeIndex = -1;

  function loadIndex() {
    if (index !== null) return Promise.resolve();
    return fetch('/' + lang + '/search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { index = data; });
  }

  function normalize(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  var i18n = window.__SEARCH_I18N__ || {};

  function factionLabel(f) { return i18n[f] || f; }
  function heroLabel() { return i18n.hero || 'Hero'; }

  function render(results) {
    activeIndex = -1;
    if (!results.length) {
      dropdown.innerHTML = '<div class="search-no-results">' + (input.dataset.noResults || 'No results') + '</div>';
    } else {
      dropdown.innerHTML = results.slice(0, 12).map(function (r, i) {
        if (r.t === 'h') {
          return '<a class="search-item search-item--hero" href="/' + lang + '/heroes/' + r.slug + '/" data-idx="' + i + '">'
            + '<span class="search-item__type">' + escHtml(heroLabel()) + '</span>'
            + '<span class="search-item__name">' + escHtml(r.name) + '</span>'
            + '</a>';
        }
        return '<a class="search-item search-item--card" href="/' + lang + '/cards/' + r.code + '/" data-idx="' + i + '">'
          + '<span class="search-item__type search-item__faction--' + escHtml(r.f) + '">' + escHtml(factionLabel(r.f)) + '</span>'
          + '<span class="search-item__name">' + escHtml(r.name) + '</span>'
          + '</a>';
      }).join('');
    }
    dropdown.hidden = false;
  }

  function escHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function search(query) {
    var q = normalize(query.trim());
    if (!q) { close(); return; }
    var results = index.filter(function (r) { return normalize(r.name).includes(q); });
    render(results);
  }

  function close() {
    dropdown.hidden = true;
    activeIndex = -1;
  }

  function setActive(idx) {
    var items = dropdown.querySelectorAll('.search-item');
    if (activeIndex >= 0 && items[activeIndex]) items[activeIndex].classList.remove('search-item--active');
    activeIndex = idx;
    if (activeIndex >= 0 && items[activeIndex]) {
      items[activeIndex].classList.add('search-item--active');
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  input.addEventListener('focus', function () {
    loadIndex().then(function () {
      if (input.value.trim()) search(input.value);
    });
  });

  input.addEventListener('input', function () {
    if (!index) { loadIndex().then(function () { search(input.value); }); return; }
    search(input.value);
  });

  input.addEventListener('keydown', function (e) {
    var items = dropdown.querySelectorAll('.search-item');
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(activeIndex + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(activeIndex - 1, 0)); }
    else if (e.key === 'Enter') {
      if (activeIndex >= 0 && items[activeIndex]) { e.preventDefault(); window.location.href = items[activeIndex].href; }
    }
    else if (e.key === 'Escape') { close(); input.blur(); }
  });

  document.addEventListener('click', function (e) {
    if (!document.getElementById('site-search').contains(e.target)) close();
  });
})();
