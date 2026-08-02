/*
	Lightbox per le copertine delle pagine collezione (.cover-slot) e per le
	foto della pagina MWC (.lb): clic per ingrandire, clic/Esc per chiudere,
	frecce laterali o frecce della tastiera per scorrere avanti e indietro.
	Sotto la foto ingrandita compare la sua didascalia (l'h3 accanto alla
	miniatura, o in mancanza il testo alternativo dell'immagine).
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
      /* immagine e didascalia impilate; la larghezza la detta il figure, cosi'
         il gruppo resta dentro il padding dell'overlay anche su schermo stretto */
      '.lightbox-figure{margin:0;min-width:0;max-width:min(100%,860px);display:flex;flex-direction:column;' +
        'align-items:center;gap:14px}' +
      '.lightbox-overlay img{max-width:100%;max-height:calc(92vh - 54px);display:block;box-shadow:0 12px 48px rgba(0,0,0,.7)}' +
      '.lightbox-caption{max-width:100%;color:rgba(255,255,255,.88);font-size:15px;line-height:1.4;' +
        'text-align:center;text-shadow:0 1px 3px rgba(0,0,0,.7)}' +
      '.lightbox-caption:empty{display:none}' +
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
      '@media (hover:none){.cover-slot.has-img::after,.cover-slot.has-img::before{display:none}}' +
      /* frecce avanti/indietro */
      '.lightbox-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:2;display:flex;' +
        'align-items:center;justify-content:center;width:54px;height:54px;padding:0;margin:0;border:0;' +
        /* disco scuro con un filo di bordo chiaro: si legge sia sul fondo nero
           dell'overlay sia sopra la foto, dove finisce su schermo stretto */
        'border-radius:50%;background:rgba(18,18,18,.5);box-shadow:inset 0 0 0 1px rgba(255,255,255,.25);' +
        'color:#fff;cursor:pointer;-webkit-appearance:none;transition:background .2s ease-in-out}' +
      '.lightbox-nav:hover{background:rgba(18,18,18,.78)}' +
      '.lightbox-nav:focus-visible{outline:solid 2px rgba(255,255,255,.85);outline-offset:3px}' +
      '.lightbox-prev{left:18px}' +
      '.lightbox-next{right:18px}' +
      /* con una sola immagine nel gruppo non c'e' niente da scorrere */
      '.lightbox-overlay.single .lightbox-nav{display:none}' +
      '@media screen and (max-width:736px){.lightbox-overlay{padding:20px 12px}' +
        '.lightbox-figure{gap:10px}.lightbox-caption{font-size:14px}' +
        '.lightbox-nav{width:42px;height:42px}.lightbox-prev{left:4px}.lightbox-next{right:4px}}';
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    var figure = document.createElement('figure');
    figure.className = 'lightbox-figure';
    var big = document.createElement('img');
    big.alt = '';
    var caption = document.createElement('figcaption');
    caption.className = 'lightbox-caption';
    figure.appendChild(big);
    figure.appendChild(caption);
    overlay.appendChild(figure);

    function arrow(dir) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lightbox-nav lightbox-' + (dir < 0 ? 'prev' : 'next');
      b.setAttribute('aria-label', dir < 0 ? 'Previous image' : 'Next image');
      b.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">' +
        '<path d="' + (dir < 0 ? 'M15 4 7 12l8 8' : 'M9 4l8 8-8 8') + '" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      // senza questo il clic arriva all'overlay, che chiude il lightbox
      b.addEventListener('click', function (e) { e.stopPropagation(); step(dir); });
      overlay.appendChild(b);
      return b;
    }
    arrow(-1);
    arrow(1);
    document.body.appendChild(overlay);

    // il gruppo su cui scorrere: le copertine fra loro, le foto fra loro
    function kindOf(img) {
      return img.closest('.cover-slot') ? 'cover' : 'photo';
    }
    var items = [], group = [], current = -1;

    function close() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      group = [];
      current = -1;
    }
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });

    function fullSrc(img) {
      return img.getAttribute('data-full') || img.src;
    }

    // il testo di un elemento saltando le parti nascoste: nei titoli dei fumetti
    // convivono la versione italiana e quella inglese (.lang-it/.lang-en), e una
    // delle due e' sempre display:none
    function visibleText(node) {
      if (node.nodeType === 3) return node.nodeValue;
      if (node.nodeType !== 1) return '';
      if (getComputedStyle(node).display === 'none') return '';
      var out = '';
      for (var i = 0; i < node.childNodes.length; i++) out += visibleText(node.childNodes[i]);
      return out;
    }

    function clean(s) {
      return (s || '').replace(/\s+/g, ' ').trim();
    }

    // fumetti: vale il titolo del volume nel masthead dell'albo, mai l'alt della
    // copertina, che ne e' solo la descrizione. Pagine foto: l'h3 accanto alla
    // miniatura, con l'alt come ultima risorsa
    function captionFor(img) {
      if (img.closest('.cover-slot')) {
        var albo = img.closest('.albo');
        var h2 = albo && albo.querySelector('.masthead h2');
        return h2 ? clean(visibleText(h2)) : '';
      }
      var box = img.closest('.lb') || img;
      var next = box.nextElementSibling;
      var h = next && /^H[1-6]$/.test(next.tagName) ? next : null;
      if (!h) {
        var item = img.closest('.work-item');
        if (item) h = item.querySelector('h1,h2,h3,h4,h5,h6');
      }
      return clean(h ? visibleText(h) : img.alt);
    }

    function show(i) {
      current = (i + group.length) % group.length;
      var img = group[current];
      big.src = fullSrc(img);
      big.alt = img.alt;
      var text = captionFor(img);
      caption.textContent = text;
      if (text) overlay.setAttribute('aria-label', text);
      else overlay.removeAttribute('aria-label');
      // la prossima e la precedente pronte in cache, cosi' il salto non lampeggia
      [group[(current + 1) % group.length], group[(current - 1 + group.length) % group.length]]
        .forEach(function (n) { if (n && n !== img) new Image().src = fullSrc(n); });
    }

    function step(dir) {
      if (group.length > 1) show(current + dir);
    }

    function open(img) {
      // le copertine mancanti vengono rimosse dal DOM da onerror: saltale
      group = items.filter(function (o) {
        return o.kind === kindOf(img) && o.img.isConnected;
      }).map(function (o) { return o.img; });
      overlay.classList.toggle('single', group.length < 2);
      var i = group.indexOf(img);
      show(i < 0 ? 0 : i);
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    imgs.forEach(function (img) {
      items.push({ img: img, kind: kindOf(img) });

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
