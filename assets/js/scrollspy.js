/* Scrollspy per il menu sticky (#bionav): evidenzia il link della sezione visibile */
(function () {
	function init() {
		var nav = document.getElementById('bionav');
		if (!nav) return;
		var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
		var map = links.map(function (a) {
			return { a: a, el: document.querySelector(a.getAttribute('href')) };
		}).filter(function (x) { return x.el; });
		if (!map.length) return;
		function spy() {
			var y = window.scrollY + 150;
			var cur = map[0];
			map.forEach(function (x) {
				if (x.el.getBoundingClientRect().top + window.scrollY <= y) cur = x;
			});
			links.forEach(function (a) { a.classList.remove('active'); });
			cur.a.classList.add('active');
		}
		window.addEventListener('scroll', spy, { passive: true });
		window.addEventListener('resize', spy);
		spy();
	}
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
