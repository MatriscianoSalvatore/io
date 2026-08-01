/*
	Clic sul video (non solo sul tasto play) per avviare e mettere in pausa,
	come sulle altre pagine con video. La striscia dei controlli nativi in
	basso resta esclusa, altrimenti ogni interazione con la barra farebbe
	anche play/pause.

	Alcuni browser (Chrome desktop) hanno già il play/pause al clic sul video:
	se toggliassimo comunque, i due effetti si annullerebbero e il video
	ripartirebbe subito dopo la pausa. Per questo lo stato viene fotografato
	al pointerdown, prima di qualsiasi azione predefinita, e il toggle manuale
	scatta solo se il browser non ha già fatto il lavoro.
*/
(function () {
	var CONTROLS_STRIP = 46; // px

	function init() {
		var videos = document.querySelectorAll('.mwc-video video');
		if (!videos.length) return;

		videos.forEach(function (v) {
			var pausedBefore = null;

			v.addEventListener('pointerdown', function () {
				pausedBefore = v.paused;
			});

			v.addEventListener('click', function (e) {
				var r = v.getBoundingClientRect();
				if (e.clientY > r.bottom - CONTROLS_STRIP) return;

				var before = pausedBefore === null ? v.paused : pausedBefore;
				pausedBefore = null;

				// let the browser's own default action land first
				setTimeout(function () {
					if (v.paused !== before) return; // already toggled for us
					if (before) v.play(); else v.pause();
				}, 0);
			});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
