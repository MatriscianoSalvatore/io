/*
	Pagina AI Pantry: i diagrammi animati partono quando entrano nello schermo
	(classe .play), e i numeri della striscia in alto si contano da zero.
	Con le animazioni ridotte tutto è già nello stato finale.
	Ogni diagramma si apre anche a schermo intero (pulsante in alto a destra o
	clic sul riquadro): una copia ingrandita che riparte da capo, con le frecce
	per passare agli altri e Esc o clic fuori per chiudere.
*/
(function () {
	var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

	var ICON_FS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
	var ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg>';
	function arrowIcon(dir) {
		return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="' + (dir < 0 ? 'M15 4 7 12l8 8' : 'M9 4l8 8-8 8') + '"/></svg>';
	}

	function countUp(el) {
		var to = parseFloat(el.getAttribute('data-count'));
		var dec = (el.getAttribute('data-count').split('.')[1] || '').length;
		var suffix = el.getAttribute('data-suffix') || '';
		if (!to || reduce) return;
		var t0 = null;
		(function step(t) {
			if (!t0) t0 = t;
			var q = Math.min(1, (t - t0) / 1400);
			el.textContent = (to * (1 - Math.pow(1 - q, 3))).toFixed(dec) + suffix;
			if (q < 1) requestAnimationFrame(step);
		})(performance.now());
	}

	// schermo intero: un overlay unico per tutti i diagrammi della pagina
	function viewer(items) {
		var over = document.createElement('div');
		over.className = 'fx-over';
		over.setAttribute('role', 'dialog');
		over.setAttribute('aria-modal', 'true');
		over.setAttribute('aria-label', 'Diagram, full screen');
		over.innerHTML = '<div class="fx-stage"></div>' +
			'<button type="button" class="fx-x" aria-label="Close" title="Close">' + ICON_X + '</button>' +
			'<button type="button" class="fx-nav fx-prev" aria-label="Previous diagram">' + arrowIcon(-1) + '</button>' +
			'<button type="button" class="fx-nav fx-next" aria-label="Next diagram">' + arrowIcon(1) + '</button>';
		document.body.appendChild(over);
		var stage = over.querySelector('.fx-stage');
		var closeBtn = over.querySelector('.fx-x');
		var card = null, current = -1, opener = null, wasFull = false;

		// la copia ha la larghezza della colonna della pagina (o dello schermo, se
		// più stretto) e poi viene scalata per riempire lo spazio libero
		function fit() {
			if (!card) return;
			var vw = over.clientWidth, vh = over.clientHeight;
			var narrow = vw < 737;
			// telefono in orizzontale: le frecce stanno ai lati, sopra e sotto basta poco
			var padX = narrow ? 16 : 84, padY = vh < 500 ? 12 : narrow ? 76 : 56;
			card.style.transform = '';
			card.style.width = Math.min(760, vw - 2 * padX) + 'px';
			var k = Math.min((vw - 2 * padX) / card.offsetWidth, (vh - 2 * padY) / card.offsetHeight, 2.4);
			card.style.transform = 'scale(' + k + ')';
		}

		function show(i) {
			current = (i + items.length) % items.length;
			var c = items[current].cloneNode(true);
			c.classList.remove('play');
			c.removeAttribute('data-fx');
			var b = c.querySelector('.fx-fs');
			if (b) b.parentNode.removeChild(b);
			// i percorsi dei pallini animati hanno un id: nella copia vanno rinominati
			c.querySelectorAll('[id]').forEach(function (el) { el.id += '-big'; });
			c.querySelectorAll('mpath').forEach(function (m) { m.setAttribute('href', m.getAttribute('href') + '-big'); });
			stage.innerHTML = '';
			stage.appendChild(c);
			card = c;
			fit();
			// due frame: la copia deve essere disegnata ferma prima di ripartire
			requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.add('play'); }); });
		}

		function open(i, from) {
			opener = from || null;
			over.classList.add('open');
			document.documentElement.classList.add('fx-lock');
			show(i);
			closeBtn.focus({ preventScroll: true });
			var rq = over.requestFullscreen || over.webkitRequestFullscreen;
			if (rq) {
				try {
					var p = rq.call(over);
					if (p && p.catch) p.catch(function () {});
				} catch (e) {}
			}
		}

		function close() {
			if (!over.classList.contains('open')) return;
			over.classList.remove('open');
			document.documentElement.classList.remove('fx-lock');
			stage.innerHTML = '';
			card = null;
			var fe = document.fullscreenElement || document.webkitFullscreenElement;
			if (fe === over) {
				var ex = document.exitFullscreen || document.webkitExitFullscreen;
				if (ex) ex.call(document);
			}
			// dopo l'uscita dal full screen, o il focus si perde
			if (opener) setTimeout(function () { opener.focus({ preventScroll: true }); }, 50);
		}

		// a schermo intero vero Esc lo intercetta il browser: quando si esce dal
		// full screen si chiude anche l'overlay
		function onFull() {
			var fe = document.fullscreenElement || document.webkitFullscreenElement;
			if (fe === over) wasFull = true;
			else if (wasFull) { wasFull = false; close(); }
			setTimeout(fit, 60);
		}
		document.addEventListener('fullscreenchange', onFull);
		document.addEventListener('webkitfullscreenchange', onFull);
		window.addEventListener('resize', fit);

		over.addEventListener('click', function (e) {
			if (e.target === over || e.target === stage) close();
		});
		closeBtn.addEventListener('click', close);
		over.querySelector('.fx-prev').addEventListener('click', function () { show(current - 1); });
		over.querySelector('.fx-next').addEventListener('click', function () { show(current + 1); });

		document.addEventListener('keydown', function (e) {
			if (!over.classList.contains('open')) return;
			if (e.key === 'Escape') { e.preventDefault(); close(); }
			else if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
			else if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
			else if (e.key === 'Tab') {
				// il focus resta sui tre pulsanti dell'overlay
				var f = over.querySelectorAll('button');
				var at = Array.prototype.indexOf.call(f, document.activeElement);
				e.preventDefault();
				f[(at + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
			}
		});

		// scorrimento col dito su telefono
		var x0 = null;
		over.addEventListener('touchstart', function (e) { x0 = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
		over.addEventListener('touchend', function (e) {
			if (x0 === null) return;
			var dx = e.changedTouches[0].clientX - x0;
			x0 = null;
			if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
		});

		items.forEach(function (el, i) {
			var b = document.createElement('button');
			b.type = 'button';
			b.className = 'fx-fs';
			b.setAttribute('aria-label', 'Open this diagram full screen');
			b.title = 'Full screen';
			b.innerHTML = ICON_FS;
			b.addEventListener('click', function (e) { e.stopPropagation(); open(i, b); });
			el.appendChild(b);
			el.addEventListener('click', function (e) {
				if (e.target.closest('a, button')) return;
				if (window.getSelection && String(getSelection())) return;
				open(i, b);
			});
		});
	}

	function init() {
		var items = document.querySelectorAll('[data-fx]');
		var numbers = document.querySelectorAll('.fx-stats [data-count]');
		if (items.length) viewer(Array.prototype.slice.call(items));
		if (!('IntersectionObserver' in window)) {
			items.forEach(function (el) { el.classList.add('play'); });
			return;
		}
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				if (!e.isIntersecting) return;
				if (e.target.hasAttribute('data-count')) countUp(e.target);
				else e.target.classList.add('play');
				io.unobserve(e.target);
			});
		}, { threshold: 0.3 });
		items.forEach(function (el) { io.observe(el); });
		numbers.forEach(function (el) { io.observe(el); });
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();
