(function () {
  var KEY = 'mc_consent';
  var stored = localStorage.getItem(KEY);

  function update(granted) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
    }
  }

  function hide() {
    var el = document.getElementById('consent-banner');
    if (el) el.remove();
  }

  // Already decided — apply stored preference and exit
  if (stored) {
    update(stored === 'granted');
    return;
  }

  function show() {
    var banner = document.getElementById('consent-banner');
    if (!banner) return;
    banner.style.display = 'flex';

    document.getElementById('consent-accept').addEventListener('click', function () {
      localStorage.setItem(KEY, 'granted');
      update(true);
      hide();
    });

    document.getElementById('consent-reject').addEventListener('click', function () {
      localStorage.setItem(KEY, 'denied');
      update(false);
      hide();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', show);
  } else {
    show();
  }
})();
