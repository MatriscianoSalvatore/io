/* Lightbox per le copertine delle pagine collezione: clic per ingrandire, clic/Esc per chiudere */
(function () {
  function init() {
    var imgs = document.querySelectorAll('.cover-slot img');
    if (!imgs.length) return;

    var style = document.createElement('style');
    style.textContent =
      '.lightbox-overlay{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:28px;background:rgba(0,0,0,.88);cursor:zoom-out}' +
      '.lightbox-overlay.open{display:flex}' +
      '.lightbox-overlay img{max-width:min(92vw,860px);max-height:92vh;display:block;box-shadow:0 12px 48px rgba(0,0,0,.7)}' +
      '.cover-slot img{cursor:zoom-in}';
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    var big = document.createElement('img');
    big.alt = '';
    overlay.appendChild(big);
    document.body.appendChild(overlay);

    function close() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    imgs.forEach(function (img) {
      img.addEventListener('click', function () {
        big.src = img.src;
        big.alt = img.alt;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
