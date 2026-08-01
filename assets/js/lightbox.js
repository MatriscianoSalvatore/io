/*
	Lightbox per le copertine delle pagine collezione (.cover-slot) e per le
	foto della pagina MWC (.lb): clic per ingrandire, clic/Esc per chiudere.
	Aggiunge anche l'overlay "View" al passaggio del mouse, lo stesso effetto
	delle thumbnail del tema Strata (.image.thumb di main.css).
*/
(function () {
  function init() {
    var imgs = document.querySelectorAll('.cover-slot img, .lb img');
    if (!imgs.length) return;

    var style = document.createElement('style');
    style.textContent =
      '.lightbox-overlay{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:28px;background:rgba(0,0,0,.88);cursor:zoom-out}' +
      '.lightbox-overlay.open{display:flex}' +
      '.lightbox-overlay img{max-width:min(92vw,860px);max-height:92vh;display:block;box-shadow:0 12px 48px rgba(0,0,0,.7)}' +
      '.cover-slot img,.lb,.lb img{cursor:zoom-in}' +
      /* the .image.thumb overlay and its "View" pill sit on top of the photo:
         let the pointer through, or they eat both the cursor and the click */
      '.lb:before,.lb:after{pointer-events:none}' +
      /* "View" hover effect on the comic covers */
      '.cover-slot.has-img::after{content:"View";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:4;' +
        'border:solid 3px rgba(255,255,255,.6);border-radius:.35em;color:#fff;font-family:"Barlow Condensed",sans-serif;' +
        'font-size:15px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;line-height:2.25em;padding:0 1.5em;' +
        'opacity:0;transition:opacity .2s ease-in-out;pointer-events:none}' +
      '.cover-slot.has-img::before{content:"";position:absolute;inset:0;z-index:3;background:rgba(16,24,43,.45);' +
        'opacity:0;transition:opacity .2s ease-in-out;pointer-events:none}' +
      '.cover-slot.has-img:hover::after,.cover-slot.has-img:hover::before{opacity:1}' +
      '@media (hover:none){.cover-slot.has-img::after,.cover-slot.has-img::before{display:none}}';
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

    function open(img) {
      big.src = img.getAttribute('data-full') || img.src;
      big.alt = img.alt;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    imgs.forEach(function (img) {
      // the decorative .cover-art shows through when a cover file is missing
      // (onerror removes the img): only slots with a real image get the effect
      var slot = img.closest('.cover-slot');
      if (slot) slot.classList.add('has-img');

      // listen on the wrapper too: on .lb the click often lands on the
      // ::before/::after of .image.thumb rather than on the img itself
      var box = img.closest('.lb') || img;
      box.addEventListener('click', function () { open(img); });
      if (box !== img) img.addEventListener('click', function (e) { e.stopPropagation(); open(img); });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
