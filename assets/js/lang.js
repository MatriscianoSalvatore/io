/*
	Italian/English toggle for the library and comics pages.
	Load synchronously in <head>: the saved language is applied before first
	paint, the slider itself is added once the DOM is ready.
	Content is marked with .lang-it / .lang-en (see assets/css/lang.css).
*/

(function() {

	var root = document.documentElement;

	var saved = 'it';
	try { saved = localStorage.getItem('sm-lang') || 'it'; } catch (e) {}
	if (saved === 'en') root.setAttribute('data-lang', 'en');

	function build() {
		var toggle = document.createElement('button');
		toggle.className = 'lang-toggle';
		toggle.type = 'button';
		toggle.setAttribute('role', 'switch');
		toggle.setAttribute('aria-label', 'English version');
		toggle.setAttribute('aria-checked', root.getAttribute('data-lang') === 'en' ? 'true' : 'false');
		toggle.innerHTML =
			'<span class="lt-flag lt-it" title="Italiano" aria-hidden="true"></span>' +
			'<span class="lt-flag lt-en" title="English" aria-hidden="true"></span>' +
			'<span class="lt-knob" aria-hidden="true"></span>';

		toggle.addEventListener('click', function() {
			var toEnglish = root.getAttribute('data-lang') !== 'en';
			if (toEnglish) {
				root.setAttribute('data-lang', 'en');
			} else {
				root.removeAttribute('data-lang');
			}
			toggle.setAttribute('aria-checked', toEnglish ? 'true' : 'false');
			try { localStorage.setItem('sm-lang', toEnglish ? 'en' : 'it'); } catch (e) {}
		});

		document.body.appendChild(toggle);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', build);
	} else {
		build();
	}

})();
