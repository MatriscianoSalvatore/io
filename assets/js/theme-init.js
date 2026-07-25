/*
	Applies the saved theme before first paint (loaded synchronously in <head>).
	Light is the default; 'dark' in localStorage activates the dark skin.
*/
try {
	if (localStorage.getItem('sm-theme') === 'dark') {
		document.documentElement.classList.add('theme-dark');
	}
} catch (e) {}
