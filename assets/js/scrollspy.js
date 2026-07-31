/* Scrollspy per il menu sticky (#bionav): evidenzia il link della sezione visibile,
   lo tiene visibile nella barra scrollabile su mobile e mostra il fade sui lati
   in cui ci sono voci fuori schermo. */
(function () {
	function init() {
		var nav = document.getElementById('bionav');
		if (!nav) return;
		var scroller = nav.querySelector('.nav-links') || nav;
		var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
		var map = links.map(function (a) {
			return { a: a, el: document.querySelector(a.getAttribute('href')) };
		}).filter(function (x) { return x.el; });
		if (!map.length) return;

		var current = null;

		function updateFades() {
			var max = scroller.scrollWidth - scroller.clientWidth;
			var x = scroller.scrollLeft;
			scroller.classList.toggle('fade-left', max > 2 && x > 2);
			scroller.classList.toggle('fade-right', max > 2 && x < max - 2);
		}

		function ensureVisible(a) {
			if (scroller.scrollWidth - scroller.clientWidth <= 2) return;
			var pad = 24;
			var ar = a.getBoundingClientRect();
			var sr = scroller.getBoundingClientRect();
			var delta = 0;
			if (ar.left < sr.left + pad) delta = ar.left - sr.left - pad;
			else if (ar.right > sr.right - pad) delta = ar.right - sr.right + pad;
			if (delta) scroller.scrollTo({ left: scroller.scrollLeft + delta, behavior: 'smooth' });
		}

		function spy() {
			var y = window.scrollY + 150;
			var cur = map[0];
			map.forEach(function (x) {
				if (x.el.getBoundingClientRect().top + window.scrollY <= y) cur = x;
			});
			if (cur.a === current) return;
			current = cur.a;
			links.forEach(function (a) {
				a.classList.remove('active');
				a.removeAttribute('aria-current');
			});
			cur.a.classList.add('active');
			cur.a.setAttribute('aria-current', 'true');
			ensureVisible(cur.a);
		}

		window.addEventListener('scroll', spy, { passive: true });
		window.addEventListener('resize', function () { spy(); updateFades(); });
		window.addEventListener('load', updateFades);
		scroller.addEventListener('scroll', updateFades, { passive: true });
		if (window.ResizeObserver) new ResizeObserver(updateFades).observe(scroller);
		if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateFades);
		spy();
		updateFades();
	}
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
