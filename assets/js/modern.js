/*
	Modern theme extras:
	1. Scroll-reveal for sections and cards (active in both light and dark theme).
	2. Light/dark theme toggle slider, persisted in localStorage ('sm-theme').
	   theme-init.js applies the saved theme before first paint; this file only
	   builds the toggle UI and handles switching.
*/

(function() {

	// --- Theme toggle ---------------------------------------------------

	var root = document.documentElement;

	function currentTheme() {
		return root.classList.contains('theme-dark') ? 'dark' : 'light';
	}

	var toggle = document.createElement('button');
	toggle.className = 'theme-toggle';
	toggle.type = 'button';
	toggle.setAttribute('role', 'switch');
	toggle.setAttribute('aria-label', 'Dark theme');
	toggle.setAttribute('aria-checked', currentTheme() === 'dark' ? 'true' : 'false');
	toggle.innerHTML =
		'<span class="tt-icon tt-sun" aria-hidden="true">☀️</span>' +
		'<span class="tt-icon tt-moon" aria-hidden="true">🌙</span>' +
		'<span class="tt-knob" aria-hidden="true"></span>';

	toggle.addEventListener('click', function() {
		root.classList.toggle('theme-dark');
		var theme = currentTheme();
		toggle.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
		try { localStorage.setItem('sm-theme', theme); } catch (e) {}
	});

	document.body.appendChild(toggle);

	// --- Scroll-reveal ---------------------------------------------------

	if (!('IntersectionObserver' in window)) return;

	root.classList.add('has-reveal');

	var targets = [];

	// Whole sections (except the first, which is visible on load anyway).
	document.querySelectorAll('#main > section').forEach(function(section, i) {
		if (i > 0) targets.push(section);
	});

	// Cards, with a small stagger inside each row.
	document.querySelectorAll('.work-item').forEach(function(item, i) {
		item.style.setProperty('--rv-delay', (i % 4) * 0.08 + 's');
		targets.push(item);
	});

	targets.forEach(function(el) { el.classList.add('rv'); });

	var observer = new IntersectionObserver(function(entries) {
		entries.forEach(function(entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('rv-in');
				observer.unobserve(entry.target);
			}
		});
	}, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

	targets.forEach(function(el) { observer.observe(el); });

})();
