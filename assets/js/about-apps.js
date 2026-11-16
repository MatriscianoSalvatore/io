/*
	About page: the apps shown inside the 3D phone, drawn with the kit of
	about-ui.js. Colours, labels and flows come from the real apps (their
	code and screenshots); every label exists in Italian and English and
	follows the language of the page through k.t(it, en).
	An app is { start, order, screens }; a screen draws itself, registers
	its tappable areas with k.hot(), and may return a live() painter.
*/

(function () {
	'use strict';

	const U = window.AboutUI;
	if (!U) return;
	const W = U.W, H = U.H, apps = U.apps, L = U.lib;
	const image = L.image, ready = L.ready, edgeColor = L.edgeColor, accent = L.accent, night = L.night;
	const arrowAt = L.arrowAt, stars = L.stars, chipRow = L.chipRow, chipRowCentered = L.chipRowCentered, cityMap = L.cityMap;
	const SANS = L.SANS, MONO = L.MONO, SERIF = L.SERIF, EM = L.EM, P = L.P, MAIL = L.MAIL;

	// The Google mark, from its four coloured shapes (48 x 48 artboard), centred on (cx, cy).
	const G_SHAPES = [
		['#EA4335', 'M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'],
		['#4285F4', 'M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'],
		['#FBBC05', 'M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'],
		['#34A853', 'M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z']
	];
	let gPaths = null;
	function googleG(k, cx, cy, size) {
		if (!gPaths && window.Path2D) gPaths = G_SHAPES.map(g => [g[0], new Path2D(g[1])]);
		if (!gPaths) { k.text('G', cx, cy + size * 0.36, size, { w: 800, c: '#4285f4', a: 'center' }); return; }
		const x = k.x, s = size / 48;
		x.save(); x.translate(cx - size / 2, cy - size / 2); x.scale(s, s);
		gPaths.forEach(g => { x.fillStyle = g[0]; x.fill(g[1]); });
		x.restore();
	}

	/* ------------------------------------------------------ profile, contact */

	apps.hello = { start: 'profile', order: ['profile'], screens: {
		profile(k) {
			const cx = W / 2;
			night(k);
			k.circle(cx, 318, 132, accent(k, cx - 132, cx + 132));
			k.img(P + 'me.jpg', cx - 122, 196, 244, 244, 122, { ph: '#16203a' });
			k.text('Salvatore', cx, 546, 60, { w: 300, c: '#eef2f9', a: 'center' });
			k.text('Matrisciano', cx, 614, 64, { w: 800, c: '#eef2f9', a: 'center' });
			k.text('Senior Mobile Developer', cx, 664, 23, { w: 500, c: '#9aa6bd', a: 'center', f: MONO });
			chipRowCentered(k, ['Android', 'Flutter', 'Kotlin'], 706, { size: 22, pad: 20, h: 48, w: 600, fill: 'rgba(255,255,255,.09)', stroke: 'rgba(255,255,255,.22)', c: '#eef2f9' });
			[['7', k.t('anni', 'years')], ['10+', k.t('app', 'apps')], ['2', k.t('talk', 'talks')]].forEach((s, i) => {
				const bx = 46 + i * 152, by = 814;
				k.rect(bx, by, 144, 150, 26, 'rgba(255,255,255,.07)');
				k.text(s[0], bx + 72, by + 82, 62, { w: 800, c: accent(k, bx, bx + 144), a: 'center' });
				k.text(s[1], bx + 72, by + 122, 21, { w: 500, c: '#9aa6bd', a: 'center', f: MONO });
			});
			k.btn(46, 1004, W - 92, 80, k.t('La mia storia', 'My story') + '  ↓', { fill: accent(k, 46, W - 46), c: '#04121a', size: 27, w: 700, act: { scroll: '#road' } });
		}
	} };

	apps.contact = { start: 'card', order: ['card'], auto: false, screens: {
		card(k) {
			night(k);
			k.text('Ciao.', 40, 400, 190, { i: 1, f: SERIF, c: accent(k, 40, 430) });
			k.text('Salvatore', 46, 500, 44, { w: 700, c: '#eef2f9' });
			k.text('Matrisciano', 46, 552, 44, { w: 700, c: '#eef2f9' });
			k.text('Senior Mobile Developer', 46, 606, 23, { w: 500, c: '#9aa6bd', f: MONO });
			k.text('Milano, IT', 46, 642, 23, { w: 500, c: '#9aa6bd', f: MONO });
			k.rect(46, 710, W - 92, 96, 26, 'rgba(255,255,255,.09)', 'rgba(255,255,255,.18)', 1.5);
			k.icon('mail', 92, 758, 34, '#2dd4a7');
			k.text('s.matrisciano@mail.com', 126, 766, 21, { w: 500, c: '#eef2f9', f: MONO });
			k.hot(46, 710, W - 92, 96, { url: MAIL });
			k.btn(46, 830, W - 92, 88, k.t('Scrivimi', 'Say hi') + '  →', { fill: accent(k, 46, W - 46), c: '#04121a', size: 28, w: 700, act: { url: MAIL } });
			const ghost = { fill: 'rgba(255,255,255,.07)', stroke: 'rgba(255,255,255,.2)', lw: 1.5, c: '#eef2f9', size: 21, w: 600 };
			k.btn(46, 944, 216, 72, 'LinkedIn', Object.assign({ act: { url: 'https://www.linkedin.com/in/salvatore-matrisciano' } }, ghost));
			k.btn(278, 944, 216, 72, 'GitHub', Object.assign({ act: { url: 'https://github.com/matriscianosalvatore' } }, ghost));
		}
	} };

	/* ------------------------------------------------- still screens (no taps) */

	apps.deloitte = { start: 'logo', order: ['logo'], screens: {
		logo(k) {
			k.fill('#000');
			const im = image('images/thumbs/deloitte.jpg');
			if (ready(im)) { const w = W * 0.82, h = w * im.naturalHeight / im.naturalWidth; k.x.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); }
		}
	} };

	apps.berlin = { start: 'photo', order: ['photo'], screens: {
		photo(k) { k.img('images/about/berlin-talk.jpg', 0, 0, W, H, 0, { px: 0.36, ph: '#20283a' }); }
	} };

	// University first, then the family bakery: the two screens alternate on their own.
	const CRIMSON = '#b5121b';
	apps.studies = { start: 'unibo', order: ['unibo', 'bakery'], screens: {
		unibo(k) {
			k.fill('#ffffff'); k.status('#3a3a3a'); k.home('#c9c9c9');
			const im = image('images/thumbs/unibo.png');
			if (ready(im)) k.x.drawImage(im, (W - 340) / 2, 176, 340, 340);
			k.text('Alma Mater Studiorum', W / 2, 600, 42, { f: SERIF, c: CRIMSON, a: 'center' });
			k.text(k.t('Università di Bologna', 'University of Bologna'), W / 2, 644, 25, { c: '#555', a: 'center' });
			k.line([[W / 2 - 40, 694], [W / 2 + 40, 694]], CRIMSON, 3);
			k.text(k.t('Ingegneria Informatica', 'Computer Engineering'), W / 2, 768, 34, { w: 700, c: '#1c1c1c', a: 'center' });
			k.text(k.t('dal 2014', 'since 2014'), W / 2, 810, 21, { c: '#777', a: 'center', f: MONO });
			chipRowCentered(k, ['Java', 'C', 'SQL', 'Java EE'], 862, { size: 19, pad: 18, h: 44, fill: '#f6eaea', c: CRIMSON, w: 600 });
		},
		// The bakery flyer: paper lighter than the page colour disappears ('darken') and the edges are feathered.
		bakery(k) {
			const src = 'images/thumbs/panificiomatrisciano.jpg', im = image(src);
			const c = edgeColor(src, 'rgb(239,229,210)');
			k.fill(c);
			if (!ready(im)) return;
			const w = 500, h = w * im.naturalHeight / im.naturalWidth;
			k.soft(src, (W - w) / 2, (H - h) / 2 - 20, w, h, c, 44, 'darken');
		}
	} };

	/* --------------------------------------------------------------- Compass */

	const INDIGO = '#3f51b5', INDIGO_D = '#303f9f';
	const heading = env => (((36 + env.rot * 70) % 360) + 360) % 360;
	const cardinal = (k, h) => (k.en ? ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] : ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'])[Math.round(h / 45) % 8];

	function compassBar(k, act) {
		k.status('#fff', INDIGO_D);
		k.rect(0, 54, W, 96, 0, INDIGO);
		k.text(k.t('Bussola', 'Compass'), 30, 114, 34, { w: 500, c: '#fff' });
		k.icon('dots', 500, 102, 34, '#fff');
		k.hot(440, 54, 100, 96, act);
	}
	function rose(k, cx, cy, R, rot) {
		const x = k.x;
		x.save(); x.translate(cx, cy); x.rotate(rot);
		[1, 0].forEach(odd => {
			for (let i = odd; i < 8; i += 2) {
				const len = odd ? R * 0.52 : R, wd = odd ? R * 0.11 : R * 0.17;
				x.save(); x.rotate(i * Math.PI / 4);
				x.beginPath(); x.moveTo(0, 0); x.lineTo(-wd, -wd); x.lineTo(0, -len); x.closePath(); x.fillStyle = '#151515'; x.fill();
				x.beginPath(); x.moveTo(0, 0); x.lineTo(wd, -wd); x.lineTo(0, -len); x.closePath(); x.fillStyle = '#fff'; x.fill();
				x.strokeStyle = '#151515'; x.lineWidth = 2; x.lineJoin = 'round'; x.stroke();
				x.restore();
			}
		});
		(k.en ? ['N', 'E', 'S', 'W'] : ['N', 'E', 'S', 'O']).forEach((l, i) => {
			const a = i * Math.PI / 2;
			x.save(); x.translate(Math.sin(a) * (R + 34), -Math.cos(a) * (R + 34)); x.rotate(a);
			k.text(l, 0, 0, 44, { w: 700, f: 'Georgia, serif', a: 'center', b: 'middle', c: i ? '#151515' : '#d32f2f' });
			x.restore();
		});
		x.restore();
	}
	function dial(k, cx, cy, R, rot) {
		const x = k.x;
		x.save(); x.translate(cx, cy); x.rotate(rot);
		k.circle(0, 0, R, 'rgba(255,255,255,.6)', '#222', 2);
		for (let i = 0; i < 72; i++) {
			x.save(); x.rotate(i * Math.PI / 36);
			k.line([[0, -R], [0, -R + (i % 6 ? 16 : 30)]], '#222', i % 6 ? 2 : 3);
			if (i % 6 === 0) k.text(String(i * 5), 0, -R - 12, 14, { a: 'center', c: '#333' });
			x.restore();
		}
		(k.en ? ['N', 'E', 'S', 'W'] : ['N', 'E', 'S', 'O']).forEach((l, i) => {
			const a = i * Math.PI / 2;
			x.save(); x.translate(Math.sin(a) * (R - 66), -Math.cos(a) * (R - 66)); x.rotate(a);
			k.text(l, 0, 0, 44, { w: 500, a: 'center', b: 'middle', c: i ? '#111' : '#d32f2f' });
			x.restore();
		});
		k.line([[-26, 0], [26, 0]], '#333', 2); k.line([[0, -26], [0, 26]], '#333', 2);
		x.restore();
	}
	function compassFoot(k, light) {
		k.rect(24, 1010, W - 48, 96, 20, light ? 'rgba(255,255,255,.92)' : '#f3f4f8');
		k.icon('pin', 62, 1056, 30, INDIGO);
		k.text('Bologna', 92, 1048, 22, { w: 600, c: '#222' });
		k.text('44.4949° N, 11.3426° E', 92, 1080, 18, { c: '#666', f: MONO });
	}

	apps.compass = { start: 'rose', order: ['rose', 'map', 'settings'], screens: {
		rose(k) {
			k.fill(k.state.bg || '#ffffff');
			compassBar(k, { go: 'settings' });
			compassFoot(k, false);
			k.btn(350, 1028, 148, 60, k.t('Mappa', 'Map'), { fill: INDIGO, size: 20, w: 600, act: { go: 'map' } });
			return { live(q, env) {
				const h = heading(env);
				q.text(Math.round(h) + '°', W / 2 + 10, 262, 78, { w: 300, c: '#222', a: 'center' });
				q.text(cardinal(q, h) + '  ·  ' + h.toFixed(1) + ' ' + q.t('gradi', 'degrees'), W / 2, 302, 20, { c: '#6f6f6f', a: 'center', f: MONO });
				rose(q, W / 2, 640, 206, -h * Math.PI / 180);
			} };
		},
		map(k) {
			cityMap(k, 0, 150, W, H - 150, { labels: [['Giardini Margherita', 60, 180], ['Via Irnerio', 300, 300], ['Bologna', 300, 700]] });
			compassBar(k, { go: 'settings' });
			compassFoot(k, true);
			k.btn(350, 1028, 148, 60, k.t('Bussola', 'Compass'), { fill: INDIGO, size: 20, w: 600, act: { go: 'rose', back: 1 } });
			return { live(q, env) {
				const h = heading(env);
				q.rect(W / 2 - 110, 172, 220, 44, 22, 'rgba(255,255,255,.92)');
				q.text(h.toFixed(1) + ' ' + q.t('gradi', 'degrees'), W / 2, 202, 21, { c: '#333', a: 'center', f: MONO });
				dial(q, W / 2, 610, 222, -h * Math.PI / 180);
				q.circle(W / 2, 610, 11, '#1a73e8', '#fff', 4);
			} };
		},
		settings(k) {
			k.fill('#ffffff');
			compassBar(k, { go: 'rose', back: 1 });
			k.text(k.t('Scegli la bussola', 'Chose Compass'), W / 2, 212, 22, { c: '#6f6f6f', a: 'center' });
			k.text(k.t('Bussola 1', 'Compass 1'), 34, 258, 24, { c: '#222' });
			k.line([[24, 280], [W - 24, 280]], '#d0d0d0', 2);
			k.text(k.t('Scegli lo sfondo', 'Chose Background'), W / 2, 336, 22, { c: '#6f6f6f', a: 'center' });
			const items = [[k.t('Bianco', 'White'), '#ffffff'], [k.t('Rosso', 'Red'), '#ffcdd2'], [k.t('Verde', 'Green'), '#c8e6c9'], [k.t('Giallo', 'Yellow'), '#fff9c4'], [k.t('Blu', 'Blue'), '#bbdefb'], [k.t('Marrone', 'Brown'), '#d7ccc8'],
				[k.t('Fotocamera', 'Camera'), 'camera'], [k.t('Mappe', 'Maps'), 'map'], [k.t('Galleria', 'Gallery'), 'grid']];
			const RH = 76;
			k.shadow('rgba(0,0,0,.28)', 26, 10); k.rect(24, 366, W - 48, items.length * RH + 20, 10, '#fff'); k.shadow();
			items.forEach((it, i) => {
				const Y = 376 + i * RH, colour = it[1].charAt(0) === '#';
				k.text(it[0], 56, Y + 48, 24, { c: '#222' });
				if (colour) k.circle(W - 70, Y + RH / 2, 16, it[1], '#b5b5b5', 1.5);
				else k.icon(it[1] === 'map' ? 'chev' : it[1], W - 70, Y + RH / 2, 26, '#888');
				if (i) k.line([[44, Y], [W - 44, Y]], '#eeeeee', 2);
				if (colour) k.hot(24, Y, W - 48, RH, { set: { bg: it[1] }, go: 'rose', back: 1 });
				else if (it[1] === 'map') k.hot(24, Y, W - 48, RH, { go: 'map' });
			});
		}
	} };

	/* --------------------------------------------------------------- Beeline */

	const BY = '#f7c93e', BYD = '#deb02c';

	function beeBar(k, title, back) {
		k.status('#fff', BYD);
		k.rect(0, 54, W, 96, 0, BY);
		if (back) { k.icon('arrow', 48, 102, 36, '#fff', 2.6); k.hot(0, 54, 120, 96, { go: back, back: 1 }); }
		k.text(title, back ? 96 : 30, 114, 32, { w: 700, c: '#fff' });
	}

	apps.beeline = { start: 'map', order: ['map', 'nav', 'rate'], screens: {
		map(k) {
			cityMap(k, 0, 150, W, H - 150, { river: 1, labels: [['CITY OF LONDON', 70, 250], ['SOUTHWARK', 250, 590], ['CAMBERWELL', 80, 840]] });
			beeBar(k, 'Beeline');
			k.shadow('rgba(0,0,0,.2)', 14, 5); k.rect(24, 172, W - 48, 64, 12, '#fff'); k.shadow();
			k.icon('search', 60, 204, 26, '#888'); k.text('Tower Bridge', 92, 213, 22, { c: '#222' });
			k.x.setLineDash([4, 14]); k.line([[286, 700], [330, 580], [392, 462]], '#555', 5); k.x.setLineDash([]);
			k.circle(286, 700, 15, '#1a73e8', '#fff', 5);
			k.icon('pin', 392, 426, 76, '#e53935');
			k.shadow('rgba(0,0,0,.2)', 14, 5); k.rect(24, 940, 300, 132, 16, '#fff'); k.shadow();
			k.text('Tower Bridge', 48, 990, 24, { w: 600, c: '#222' });
			k.text('1.2 km  ·  6 min', 48, 1030, 19, { c: '#777', f: MONO });
			k.shadow('rgba(0,0,0,.3)', 18, 8); k.circle(436, 1006, 66, BY); k.shadow();
			k.text('GO!', 436, 1008, 34, { w: 800, c: '#fff', a: 'center', b: 'middle' });
			k.hot(356, 926, 160, 160, { go: 'nav' });
		},
		nav(k) {
			k.fill('#333333');
			beeBar(k, 'Tower Bridge', 'map');
			k.rect(24, 944, W - 48, 132, 18, 'rgba(255,255,255,.08)');
			[['17.8', 'km/h'], ['6', 'min'], ['1.2', 'km']].forEach((s, i) => {
				k.text(s[0], 110 + i * 160, 1004, 32, { w: 600, c: '#fff', a: 'center' });
				k.text(s[1], 110 + i * 160, 1040, 17, { c: 'rgba(255,255,255,.55)', a: 'center', f: MONO });
			});
			k.btn(W / 2 - 150, 826, 300, 70, k.t('Fine del giro', 'End ride'), { fill: BY, c: '#333', size: 22, w: 700, act: { go: 'rate' } });
			return { live(q, env) {
				const a = 14 + env.rot * 60 + Math.sin(env.t * 0.9) * 8, x = q.x;
				x.save(); x.translate(W / 2, 470); x.rotate(a * Math.PI / 180);
				q.line([[-88, 64], [0, -74], [88, 64]], '#fff', 48);
				x.restore();
				q.text(Math.round(((a % 360) + 360) % 360) + '°', W / 2, 720, 52, { w: 700, c: '#fff', a: 'center' });
			} };
		},
		rate(k) {
			k.fill('#3a3a3a');
			beeBar(k, k.t('Riepilogo', 'Summary'), 'nav');
			k.rect(40, 200, W - 80, 610, 12, BY);
			k.text(k.t('Com’è andato il giro?', 'How was your ride?'), W / 2, 280, 31, { w: 500, c: '#fff', a: 'center' });
			k.circle(W / 2, 430, 96, '#fff');
			// the slider: drag it (or tap along it) and the face follows
			k.hot(56, 556, W - 112, 100, { slide: { key: 'mood', x0: 86, x1: W - 86 } });
			k.btn(W / 2 - 110, 716, 220, 66, k.t('Salva', 'Save'), { fill: '#fff', c: '#333', size: 22, w: 700, act: { go: 'map', back: 1 } });
			[['2.99', 'km'], ['10:05', k.t('durata', 'duration')], ['17.78', 'km/h']].forEach((s, i) => {
				k.text(s[0], 110 + i * 160, 920, 32, { c: '#fff', a: 'center' });
				k.text(s[1], 110 + i * 160, 956, 17, { c: 'rgba(255,255,255,.55)', a: 'center', f: MONO });
			});
			return { live(q, env) {
				const m = env.state.mood == null ? 0.86 : env.state.mood, c = (m - 0.5) * 2, x = q.x, cx = W / 2;
				// eyes, and eyebrows that slant when the ride went badly
				q.circle(cx - 34, 408, 11, '#333'); q.circle(cx + 34, 408, 11, '#333');
				if (c < -0.15) {
					const up = -c * 12;
					q.line([[cx - 52, 386], [cx - 20, 386 - up]], '#333', 6); q.line([[cx + 52, 386], [cx + 20, 386 - up]], '#333', 6);
				}
				// the mouth: one curve, bent down into a smile or up into a frown
				x.beginPath(); x.moveTo(cx - 46, 466 - c * 12); x.quadraticCurveTo(cx, 466 + c * 46, cx + 46, 466 - c * 12);
				x.strokeStyle = '#333'; x.lineWidth = 9; x.lineCap = 'round'; x.stroke();
				const kx = 86 + (W - 172) * m;
				q.line([[86, 606], [W - 86, 606]], 'rgba(255,255,255,.55)', 4);
				q.line([[86, 606], [kx, 606]], '#fff', 4);
				q.shadow('rgba(0,0,0,.25)', 8, 2); q.circle(kx, 606, 18, '#fff'); q.shadow();
				const words = q.en ? ['Awful', 'Bad', 'So-so', 'Good!', 'Great!'] : ['Malissimo', 'Male', 'Così così', 'Bene!', 'Benissimo!'];
				q.text(words[Math.min(4, Math.floor(m * 5))], 86, 672, 28, { c: '#fff' });
			} };
		}
	} };

	/* ------------------------------------------------------- Visitup Bologna */

	const VB = '#1e88c7', VBD = '#176fa6', VO = '#f6921e';

	function vLogo(k, cx, cy, r, c) {
		k.circle(cx, cy, r, null, c || VO, r * 0.16);
		k.line([[cx - r * 0.42, cy - r * 0.42], [cx - r * 0.02, cy + r * 0.5], [cx + r * 0.74, cy - r * 1.18]], c || VO, r * 0.2);
	}
	function vbBar(k, back) {
		k.status('#fff', VBD);
		k.rect(0, 54, W, 100, 0, VB);
		if (back) { k.icon('arrow', 44, 104, 34, '#fff', 2.6); k.hot(0, 54, 120, 100, { go: back, back: 1 }); }
		else { k.icon('menu', 44, 104, 34, '#fff', 2.6); k.icon('chat', 494, 104, 30, '#fff'); }
		vLogo(k, W / 2, 110, 26);
	}

	// Bottom bar with numbered steps: the one in view carries its name, a tap on another one changes `key` in the app state.
	function vbTabs(k, labels, active, key) {
		k.rect(0, H - 122, W, 122, 0, '#fff'); k.line([[0, H - 122], [W, H - 122]], '#e3e3e3', 2);
		const step = W / labels.length;
		labels.forEach((t, i) => {
			const cx = step * (i + 0.5), on = i === active, c = on ? VB : '#9aa3aa';
			k.circle(cx, H - 84, 17, null, c, 2.5);
			k.text(String(i + 1), cx, H - 83, 20, { w: 600, c, a: 'center', b: 'middle' });
			if (on || labels.length < 4) {
				k.x.font = '400 16px ' + SANS;
				const half = k.x.measureText(t).width / 2 + 8;
				k.text(t, Math.max(half, Math.min(W - half, cx)), H - 40, 16, { c, a: 'center' });
			}
			if (!on) { const set = {}; set[key] = i; k.hot(cx - step / 2, H - 122, step, 122, { set }); }
		});
	}
	// Heading of a tour page: the number in a ring and the title on one or two lines. Returns the baseline of the text below.
	function vbTitle(k, n, title, y) {
		k.circle(44, y - 12, 20, null, VO, 3);
		k.text(String(n), 44, y - 11, 26, { w: 700, c: VO, a: 'center', b: 'middle' });
		return k.wrap(title, 76, y, W - 96, 25, 31, { w: 800, c: VO }) + 15;
	}

	// The three days of the historical tour, as in the app.
	const DAYS = k => [
		{ hero: 'bologna.jpg', places: ['maggiore', 'petronio', 'nettuno'],
			text: k.t('Bologna è una città davvero fantastica: “la Dotta, la Grassa, la Rossa”. Ospita l’università più antica del mondo occidentale, fondata nel 1088.',
				'Bologna is a truly fantastic city: “the Learned, the Fat, the Red”. It hosts the oldest university in the western world, founded in 1088.'),
			prog: k.en ? ['Piazza Maggiore and its monuments: about 2 hours', 'Quadrilatero and the old market: about 1 hour', 'The Two Towers and Piazza della Mercanzia: about 1 hour']
				: ['Piazza Maggiore con i suoi monumenti: 2 ore circa', 'Quadrilatero e mercato antico: 1 ora circa', 'Due Torri e Piazza della Mercanzia: 1 ora circa'] },
		{ hero: 'st-d2.jpg', places: ['torri', 'piella', 'sanluca'],
			text: k.t('Si parte sotto le Due Torri e si entra nel ghetto ebraico, poi la zona universitaria fino a Piazza Verdi. Si chiude con il pellegrinaggio alla Basilica di San Luca.',
				'Start under the Two Towers and walk into the Jewish ghetto, then the university area up to Piazza Verdi. End with the pilgrimage to the Basilica of San Luca.'),
			prog: k.en ? ['From the Two Towers to the Jewish ghetto: about 1 hour', 'University, Piazza Verdi, Teatro Comunale: about 2 hours', 'Pilgrimage to the Basilica of San Luca: about 2 hours']
				: ['Dalle Due Torri al ghetto ebraico: 1 ora circa', 'Università, Piazza Verdi, Teatro Comunale: 2 ore circa', 'Pellegrinaggio alla Basilica di San Luca: 2 ore circa'] },
		{ hero: 'st-d3.jpg', places: ['pratello', 'margherita'],
			text: k.t('Da via Indipendenza e via D’Azeglio fino alla Galleria Cavour, poi il Pratello con la Basilica di San Francesco. Si chiude in relax ai Giardini Margherita, il polmone verde di Bologna.',
				'From Via Indipendenza and Via D’Azeglio to Galleria Cavour, then the Pratello with the Basilica of San Francesco. End relaxing in the Giardini Margherita, the green lung of Bologna.'),
			prog: k.en ? ['Shopping district: about 3 hours', 'Pratello and Basilica of San Francesco: about 2 hours', 'Giardini Margherita: about 2 hours']
				: ['Quartiere commerciale: 3 ore circa', 'Pratello e Basilica di San Francesco: 2 ore circa', 'Giardini Margherita: 2 ore circa'] }
	];
	// The places of the historical tour: each has its page, with the audioguide. Photos are the ones of the app.
	const PLACES = k => {
		const free = k.t('Passaggio libero tutti i giorni, senza orari.', 'Free passage every day, at any time.');
		return {
			maggiore: { name: 'Piazza Maggiore', img: 'st-maggiore.jpg', where: 'Piazza Maggiore, Bologna',
				info: k.t('Accesso: libero tutti i giorni, senza limitazioni.', 'Access: free every day, with no restrictions.'),
				text: k.t('Il cuore della città dal Duecento, chiusa tra Palazzo d’Accursio, Palazzo del Podestà e la Basilica di San Petronio.', 'The heart of the city since the 13th century, enclosed by Palazzo d’Accursio, Palazzo del Podestà and the Basilica of San Petronio.') },
			petronio: { name: 'Basilica di San Petronio', img: 'st-petronio.jpg', where: 'Piazza Maggiore, Bologna',
				info: k.t('L’interno si visita gratis tutti i giorni, dalle 7:45 alle 18. Terrazza e Cappella dei Magi sono a pagamento: 3 €.', 'The interior can be visited for free every day, 7:45 to 18:00. The terrace and the Chapel of the Magi are ticketed: €3.'),
				text: k.t('Dedicata al patrono della città: lunga 132 metri e larga 60, è tra le chiese più grandi del mondo. I lavori iniziarono nel 1390.', 'Dedicated to the patron saint of the city: 132 metres long and 60 wide, it is among the largest churches in the world. Building began in 1390.') },
			nettuno: { name: 'Fontana del Nettuno', img: 'st-nettuno.jpg', where: 'Piazza del Nettuno, Bologna', info: free,
				text: k.t('La fontana del Giambologna, finita nel 1566: per i bolognesi è “il Gigante”.', 'Giambologna’s fountain, finished in 1566: the Bolognese call it “the Giant”.') },
			torri: { name: k.t('Le Due Torri', 'The Two Towers'), img: 'bologna.jpg', where: 'Piazza di Porta Ravegnana, Bologna',
				info: k.t('La piazza è sempre accessibile.', 'The square is always open.'),
				text: k.t('Asinelli e Garisenda, simbolo della città: la più alta misura 97 metri, l’altra pende dal Medioevo.', 'Asinelli and Garisenda, the symbol of the city: the taller one is 97 metres high, the other has been leaning since the Middle Ages.') },
			piella: { name: 'Finestra di via Piella', img: 'st-piella.jpg', where: 'Via Piella 5, Bologna', info: free,
				text: k.t('Una finestrella sul canale delle Moline: la “piccola Venezia” di Bologna.', 'A small window over the Moline canal: Bologna’s “little Venice”.') },
			sanluca: { name: 'Basilica di San Luca', img: 'st-d2.jpg', where: 'Via di San Luca 36, Bologna',
				info: k.t('Si sale a piedi lungo il portico, dall’arco del Meloncello.', 'You walk up along the portico, from the Meloncello arch.'),
				text: k.t('Il santuario sul Colle della Guardia, unito alla città dal portico più lungo del mondo: 666 archi.', 'The sanctuary on the Colle della Guardia, joined to the city by the longest portico in the world: 666 arches.') },
			pratello: { name: 'Il Pratello', img: 'ap-z3.jpg', where: 'Via del Pratello, Bologna',
				info: k.t('Strada sempre accessibile: si anima dal tardo pomeriggio.', 'The street is always open: it comes alive from late afternoon.'),
				text: k.t('Rione popolare e bohémien, tra osterie e locali, accanto alla Basilica di San Francesco.', 'A working-class, bohemian quarter of osterie and bars, next to the Basilica of San Francesco.') },
			margherita: { name: 'Giardini Margherita', img: 'st-d3.jpg', where: 'Viale Gozzadini, Bologna',
				info: k.t('Il parco è aperto tutti i giorni.', 'The park is open every day.'),
				text: k.t('Il parco più grande del centro, inaugurato nel 1879: il polmone verde di Bologna.', 'The largest park of the centre, opened in 1879: the green lung of Bologna.') }
		};
	};
	// The aperitivo tour: four areas of the centre, each with its bars. Photos are the ones of the app.
	const ZONES = k => [
		{ name: 'Mercato delle Erbe', hero: 'ap-z1.jpg', venue: 'Banco 32', vimg: 'ap-v1.jpg',
			text: k.t('Dalle bancarelle alle tavole apparecchiate: di giorno mercato coperto, la sera si riempie di giovani tra i suoi tanti locali. Qui non si sbaglia mai!',
				'From market stalls to laid tables: a covered market by day, in the evening it fills with young people and its many bars. You can’t go wrong here!') },
		{ name: k.t('Zona Centro', 'City centre'), hero: 'ap-z2.jpg', venue: 'Osteria del Sole', vimg: 'ap-v2.jpg',
			text: k.t('Intorno a Piazza Maggiore e nelle vie accanto i locali sono tanti, carini e poco turistici. Ecco quelli giusti.',
				'Around Piazza Maggiore and in the streets nearby there are many nice bars, not touristy at all. Here are the right ones.') },
		{ name: k.t('Zona Pratello', 'Pratello'), hero: 'ap-z3.jpg', venue: 'Mutenye', vimg: 'ap-v3.jpg',
			text: k.t('Via del Pratello è un rione popolare e bohémien, famoso per la vita notturna: dalle 18 locali e bar si riempiono, fino a tarda notte.',
				'Via del Pratello is a working-class, bohemian quarter famous for its nightlife: from 6 pm its bars fill up, until late at night.') },
		{ name: k.t('Zona Universitaria', 'University area'), hero: 'ap-z4.jpg', venue: 'La Scuderia', vimg: 'ap-v4.jpg',
			text: k.t('Piazza Verdi è il cuore della zona universitaria: caffetterie, ristoranti etnici, birrerie e locali pieni di studenti.',
				'Piazza Verdi is the heart of the university area: cafés, ethnic restaurants, pubs and bars full of students.') }
	];
	const VENUES = k => [
		{ name: 'Banco 32', img: 'ap-banco.jpg', where: 'Mercato delle Erbe, Bologna',
			text: k.t('Un ottimo posto dove assaporare pesce di qualità, seduti al bancone o al tavolo. Affollato per l’aperitivo, a cena diventa ristorante.',
				'A great place to enjoy quality fish, sitting at the counter or at a table. Crowded at aperitif time, a restaurant at dinner.'),
			hours: k.en ? ['Tue–Thu: 12.30 – 15.45 and 18.30 – 22.00', 'Fri: 12.30 – 15.45 and 18.30 – 23.00', 'Sat: 12.30 – 15.45 and 19.00 – 23.00']
				: ['Mar-Gio: 12.30 – 15.45 e 18.30 – 22.00', 'Ven: 12.30 – 15.45 e 18.30 – 23.00', 'Sab: 12.30 – 15.45 e 19.00 – 23.00'] },
		{ name: 'Osteria del Sole', img: 'ap-v2.jpg', where: 'Vicolo Ranocchi, Bologna',
			text: k.t('Osteria storica, aperta dal 1465: qui si ordina solo da bere, il cibo si porta da fuori.', 'A historic osteria, open since 1465: you order drinks only and bring your own food.') },
		{ name: 'Mutenye', img: 'ap-v3.jpg', where: 'Via del Pratello, Bologna',
			text: k.t('Uno dei locali simbolo del Pratello: si riempie all’aperitivo e resta vivo fino a tarda notte.', 'One of the best-known bars of the Pratello: it fills up at aperitif time and stays lively until late.') },
		{ name: 'La Scuderia', img: 'ap-v4.jpg', where: 'Piazza Verdi, Bologna',
			text: k.t('Nelle antiche scuderie di Palazzo Bentivoglio, in Piazza Verdi: caffetteria di giorno, locale la sera.', 'In the old stables of Palazzo Bentivoglio, on Piazza Verdi: a café by day, a bar in the evening.') }
	];
	// The restaurant tour: four kinds of cooking, with what to order.
	const CUISINES = k => [
		{ name: k.t('Cucina bolognese', 'Bolognese cooking'), tab: k.t('Bolognese', 'Bolognese'),
			text: k.t('La Grassa a tavola: pasta fresca tirata a mano e ragù che cuoce per ore, nelle trattorie del centro.', 'The Fat One at the table: hand-rolled fresh pasta and ragù that simmers for hours, in the trattorias of the centre.'),
			dishes: [['🥟', 'Tortellini in brodo'], ['🍝', 'Tagliatelle al ragù'], ['🧀', k.t('Lasagne verdi al forno', 'Baked green lasagne')]] },
		{ name: k.t('Taglieri e crescentine', 'Cold cuts and crescentine'), tab: k.t('Taglieri', 'Cold cuts'),
			text: k.t('Salumi, formaggi e pane caldo da dividere: il modo più bolognese di cominciare la cena.', 'Cured meats, cheese and warm bread to share: the most Bolognese way to start dinner.'),
			dishes: [['🥓', 'Mortadella Bologna'], ['🫓', k.t('Crescentine e tigelle', 'Crescentine and tigelle')], ['🧀', 'Parmigiano Reggiano']] },
		{ name: k.t('Pesce', 'Fish'), tab: k.t('Pesce', 'Fish'),
			text: k.t('Bologna non ha il mare, ma l’Adriatico è a un’ora: crudi, fritti e primi di pesce.', 'Bologna has no sea, but the Adriatic is an hour away: raw fish, fried fish and seafood pasta.'),
			dishes: [['🐟', k.t('Crudi di pesce', 'Raw fish')], ['🍤', k.t('Fritto misto', 'Mixed fried fish')], ['🍝', k.t('Spaghetti alle vongole', 'Spaghetti with clams')]] },
		{ name: 'Street food', tab: 'Street food',
			text: k.t('Per mangiare camminando sotto i portici: un panino, una fetta di pizza e il gelato.', 'To eat while walking under the porticoes: a sandwich, a slice of pizza and a gelato.'),
			dishes: [['🥪', k.t('Panino con la mortadella', 'Mortadella sandwich')], ['🍕', k.t('Pizza al taglio', 'Pizza by the slice')], ['🍦', k.t('Gelato artigianale', 'Artisan gelato')]] }
	];

	// `venue` is reached only by tapping a bar: it stays out of the screens that advance by themselves.
	apps.visitupbo = { start: 'splash', order: ['splash', 'home', 'tour', 'aperitivo', 'ristoranti'], screens: {
		splash(k) {
			k.fill(VB); k.status('#fff', VBD);
			vLogo(k, W / 2 - 14, 440, 112);
			k.text('Visitup', W / 2, 680, 66, { w: 800, c: '#fff', a: 'center' });
			k.text('BOLOGNA', W / 2, 726, 26, { w: 600, c: VO, a: 'center', ls: 10 });
			k.text(k.t('La guida virtuale della città', 'The virtual guide to the city'), W / 2, 790, 22, { c: 'rgba(255,255,255,.85)', a: 'center' });
			k.btn(W / 2 - 150, 930, 300, 76, k.t('Inizia il tour', 'Start the tour'), { fill: VO, size: 24, w: 700, act: { go: 'home' } });
		},
		home(k) {
			k.fill('#ffffff');
			vbBar(k);
			k.rect(0, 154, W, 74, 0, VB);
			['TOUR', k.t('STORIA', 'HISTORY'), 'INFO'].forEach((t, i) => k.text(t, 90 + i * 180, 200, 20, { w: 700, c: i ? 'rgba(255,255,255,.8)' : VO, a: 'center' }));
			k.rect(0, 222, 180, 6, 0, VO);
			vLogo(k, 96, 286, 20);
			k.text(k.t('SCEGLI UN TOUR', 'CHOOSE A TOUR'), 134, 300, 32, { w: 800, c: VB });
			[[P + 'vis-tour1.jpg', k.t('Tour Storico', 'Historical Tour'), { set: { day: 0 }, go: 'tour' }],
				[P + 'spritz.jpg', k.t('Tour Aperitivo', 'Aperitif Tour'), { set: { zone: 0 }, go: 'aperitivo' }],
				[P + 'vis-tour2.jpg', k.t('Tour Ristoranti', 'Restaurant Tour'), { set: { cuisine: 0 }, go: 'ristoranti' }]].forEach((c, i) => {
				const Y = 334 + i * 272;
				k.img(c[0], 14, Y, W - 28, 256, 6);
				k.x.font = '800 30px ' + SANS;
				const tw = k.x.measureText(c[1]).width + 28;
				k.rect(W - 14 - tw, Y + 198, tw, 46, 0, 'rgba(255,255,255,.9)');
				k.text(c[1], W - 28, Y + 232, 30, { w: 800, c: VO, a: 'right' });
				k.hot(14, Y, W - 28, 256, c[2]);
			});
		},
		tour(k) {
			const d = Math.min(2, k.state.day || 0), day = DAYS(k)[d];
			k.fill('#ffffff');
			vbBar(k, 'home');
			k.img(P + day.hero, 0, 154, W, 270, 0);
			let y = vbTitle(k, d + 1, k.t('TOUR STORICO: GIORNO ', 'HISTORICAL TOUR: DAY ') + (d + 1), 486);
			y = k.wrap(day.text, 22, y + 1, W - 44, 19, 27, { c: '#333' });
			k.text(k.t('Programma giorno ', 'Programme, day ') + (d + 1), 22, y + 22, 25, { w: 700, c: VB });
			y += 58;
			day.prog.forEach(b => { y = k.wrap('• ' + b, 22, y, W - 44, 19, 27, { c: '#333' }); });
			// the places of the day: each row opens its page
			const places = PLACES(k), rh = Math.min(76, (H - 132 - y) / day.places.length - 8);
			day.places.forEach(id => {
				const pl = places[id];
				k.rect(22, y, W - 44, rh, 12, '#f3f7fa', '#dfe8ee', 1.5);
				k.img(P + pl.img, 30, y + 7, (rh - 14) * 1.5, rh - 14, 8);
				k.text(pl.name, 48 + (rh - 14) * 1.5, y + rh / 2 + 8, 22, { w: 700, c: VB });
				k.icon('chev', W - 50, y + rh / 2, 20, VB);
				k.hot(22, y, W - 44, rh, { set: { poi: id, playing: false, pos: 0 }, go: 'place' });
				y += rh + 8;
			});
			vbTabs(k, k.en ? ['First day', 'Second day', 'Third day'] : ['Primo giorno', 'Secondo giorno', 'Terzo giorno'], d, 'day');
		},
		place(k) {
			const all = PLACES(k), pl = all[k.state.poi] || all.maggiore, x = k.x;
			k.fill('#ffffff');
			vbBar(k, 'tour');
			k.img(P + pl.img, 0, 154, W, 300, 0);
			let y = k.wrap(pl.name.toUpperCase(), 22, 506, W - 44, 30, 36, { w: 800, c: VO }) + 18;
			const head = (label, draw) => {
				k.circle(48, y, 24, VB); draw(48, y);
				k.text(label, 86, y + 8, 23, { w: 700, c: VB });
				y += 44;
			};
			// the audioguide: headphones, the track and its three buttons
			head(k.t('Audioguida', 'Audioguide'), (cx, cy) => {
				x.beginPath(); x.arc(cx, cy + 2, 11, Math.PI, 0); x.strokeStyle = '#fff'; x.lineWidth = 3; x.stroke();
				k.rect(cx - 14, cy + 1, 7, 12, 3, '#fff'); k.rect(cx + 7, cy + 1, 7, 12, 3, '#fff');
			});
			const py = y + 6;
			[['play', { set: { playing: true }, stamp: 1 }], ['pause', { set: { playing: false } }], ['stop', { set: { playing: false, pos: 0 } }]].forEach((b, i) => {
				const bx = W / 2 - 138 + i * 94;
				k.rect(bx, py + 30, 88, 44, 4, VB);
				if (b[0] === 'stop') k.rect(bx + 36, py + 44, 16, 16, 2, '#fff'); else k.icon(b[0], bx + 44, py + 52, 22, '#fff');
				k.hot(bx - 3, py + 22, 94, 60, b[1]);
			});
			y = py + 116;
			head(k.t('Informazioni', 'Information'), (cx, cy) => k.text('i', cx, cy + 10, 30, { w: 700, c: '#fff', a: 'center', f: 'Georgia, serif' }));
			y = k.wrap(pl.info, 22, y, W - 44, 18, 25, { c: '#333' }) + 28;
			head(k.t('Posizione', 'Location'), (cx, cy) => k.icon('pin', cx, cy, 26, '#fff', 2.4));
			k.text(pl.where, 22, y, 18, { c: VO });
			y += 52;
			if (y < H - 150) {
				head(k.t('Descrizione', 'Description'), (cx, cy) => { k.line([[cx - 9, cy - 6], [cx + 9, cy - 6]], '#fff', 3); k.line([[cx - 9, cy], [cx + 9, cy]], '#fff', 3); k.line([[cx - 9, cy + 6], [cx + 3, cy + 6]], '#fff', 3); });
				y = k.wrap(pl.text, 22, y, W - 44, 18, 25, { c: '#333', max: Math.max(1, Math.floor((H - 30 - y) / 25)) });
			}
			// where it is, on a small map, when the page has room left
			const mh = H - 34 - (y + 4);
			if (mh > 120) {
				x.save(); k.path(22, y + 4, W - 44, mh, 14); x.clip();
				cityMap(k, 22, y + 4, W - 44, mh, {});
				x.restore();
				k.icon('pin', W / 2, y + 4 + mh / 2 - 16, 52, '#e53935');
			}
			return { live(q, env) {
				// The track plays (sped up) while `playing` is set. Pause leaves it where it is, and play goes on
				// from there: `base` is the position at the last press of play (t0). Only stop sends it back to the start.
				const st = env.state, dur = 96;
				if (st.playing) {
					if (st.from !== st.t0) { st.from = st.t0; st.base = st.pos || 0; }
					st.pos = (st.base + (env.now - st.t0) / 1000 * 4) % dur;
				}
				const f = (st.pos || 0) / dur;
				q.line([[36, py], [W - 36, py]], '#d9d9d9', 3);
				if (f > 0) q.line([[36, py], [36 + (W - 72) * f, py]], VO, 3);
				q.circle(36 + (W - 72) * f, py, 8, VO);
				if (st.playing) { q.rect(W / 2 - 138, py + 74, 88, 4, 2, VO); }
			} };
		},
		aperitivo(k) {
			const zones = ZONES(k), z = Math.min(3, k.state.zone || 0), zone = zones[z];
			k.fill('#ffffff');
			vbBar(k, 'home');
			k.img(P + zone.hero, 0, 154, W, 268, 0);
			let y = vbTitle(k, z + 1, k.t('TOUR APERITIVO: ', 'APERITIF TOUR: ') + zone.name.toUpperCase(), 484);
			y = k.wrap(zone.text, 22, y, W - 44, 19, 27, { c: '#333' });
			// the bar of this area: a photo card that opens its page
			const top = y - 2, ch = Math.min(372, H - 140 - top);
			k.shadow('rgba(0,0,0,.2)', 14, 5); k.rect(22, top, W - 44, ch, 6, '#fff'); k.shadow();
			k.img(P + zone.vimg, 22, top, W - 44, ch - 56, 6);
			k.text(zone.venue, 36, top + ch - 19, 26, { w: 700, c: VB });
			k.icon('chev', W - 50, top + ch - 28, 22, VB);
			k.hot(22, top, W - 44, ch, { go: 'venue' });
			vbTabs(k, zones.map(q => q.name), z, 'zone');
		},
		venue(k) {
			const v = VENUES(k)[Math.min(3, k.state.zone || 0)];
			k.fill('#ffffff');
			vbBar(k, 'aperitivo');
			k.img(P + v.img, 0, 154, W, 380, 0);
			k.text(v.name.toUpperCase(), 22, 594, 32, { w: 800, c: VO });
			let y = k.wrap(v.text, 22, 640, W - 44, 19, 27, { c: '#333' }) + 34;
			const row = (icon, label) => {
				k.circle(48, y, 26, VB); k.icon(icon, 48, y, 28, '#fff', 2.4);
				k.text(label, 90, y + 9, 24, { w: 700, c: VB });
				y += 58;
			};
			if (v.hours) {
				row('clock', k.t('Orari', 'Opening hours'));
				v.hours.forEach(h => { k.text(h, 22, y, 19, { c: '#333' }); y += 27; });
				y += 36;
			}
			row('pin', k.t('Indirizzo', 'Address'));
			k.text(v.where, 22, y, 19, { c: VO });
			// where it is, on a small map, when the page has room left
			const mh = H - 36 - (y + 26);
			if (mh > 130) {
				k.x.save(); k.path(22, y + 26, W - 44, mh, 14); k.x.clip();
				cityMap(k, 22, y + 26, W - 44, mh, {});
				k.x.restore();
				k.icon('pin', W / 2, y + 26 + mh / 2 - 18, 56, '#e53935');
			}
		},
		ristoranti(k) {
			const all = CUISINES(k), n = Math.min(3, k.state.cuisine || 0), c = all[n];
			k.fill('#ffffff');
			vbBar(k, 'home');
			k.img(P + 'vis-tour2.jpg', 0, 154, W, 268, 0);
			let y = vbTitle(k, n + 1, k.t('TOUR RISTORANTI: ', 'RESTAURANT TOUR: ') + c.name.toUpperCase(), 484);
			y = k.wrap(c.text, 22, y, W - 44, 19, 27, { c: '#333' });
			k.text(k.t('Da provare', 'What to order'), 22, y + 22, 25, { w: 700, c: VB });
			y += 48;
			c.dishes.forEach(d => {
				k.rect(22, y, W - 44, 84, 14, '#f3f7fa', '#dfe8ee', 1.5);
				k.circle(70, y + 42, 28, '#fff', '#dfe8ee', 1.5);
				k.text(d[0], 70, y + 53, 30, { a: 'center', f: EM });
				k.text(d[1], 116, y + 51, 23, { w: 600, c: '#22313a' });
				y += 96;
			});
			vbTabs(k, all.map(q => q.tab), n, 'cuisine');
		}
	} };

	/* ---------------------------------------------------------------- Keiken */

	const KB = '#0099cc', KBD = '#006b9b', KBL = '#3fb3d8';

	function lighthouse(k, cx, top, s, c) {
		const x = k.x;
		const Q = pts => { x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(cx + p[0] * s, top + p[1] * s) : x.moveTo(cx + p[0] * s, top + p[1] * s))); x.stroke(); };
		x.save(); x.strokeStyle = c; x.lineWidth = 3 * s; x.lineJoin = 'round'; x.lineCap = 'round';
		Q([[-9, 14], [0, 2], [9, 14], [-9, 14]]); Q([[-7, 14], [-7, 26], [7, 26], [7, 14]]); Q([[-13, 26], [13, 26]]);
		Q([[-9, 26], [-16, 84], [16, 84], [9, 26]]);
		Q([[-11, 44], [11, 36]]); Q([[-13, 60], [13, 50]]); Q([[-15, 76], [15, 64]]);
		Q([[-12, 15], [-44, 5]]); Q([[-12, 21], [-46, 22]]);
		x.restore();
	}
	function keikenHead(k) {
		k.status('#fff', KBD);
		k.rect(0, 54, W, 100, 0, KB);
		lighthouse(k, 196, 68, 0.8, '#fff');
		k.text('Keiken', 230, 120, 34, { w: 500, c: '#fff', ls: 4, f: MONO });
	}
	const EXP = k => [
		{ img: P + 'bologna.jpg', cat: k.t('#cultura #sport', '#culture #sport'), price: '3€', title: k.t('A piedi a San Luca', 'A walk to San Luca'), host: 'Salvatore', n: 4, me: 1 },
		{ img: P + 'vis-tour2.jpg', cat: k.t('#cibo', '#food'), price: '15€', title: k.t('Tortellini fatti a mano', 'Handmade tortellini'), host: 'Giulia', n: 5 }
	];

	apps.keiken = { start: 'launcher', order: ['launcher', 'home', 'detail'], screens: {
		launcher(k) {
			k.img(P + 'coast.jpg', 0, 0, W, H, 0, { shade: 'rgba(6,20,30,.42)' });
			k.status('#fff');
			lighthouse(k, 94, 232, 1.55, '#fff');
			k.text('Keiken', 152, 350, 72, { w: 500, c: '#fff', ls: 9, f: MONO });
			k.text(k.t('Esperienze create da persone come te', 'Experiences made by people like you'), W / 2, 440, 22, { c: 'rgba(255,255,255,.88)', a: 'center' });
			k.rect(22, 776, W - 44, 64, 6, '#3b5998'); k.text('f', 46, 822, 36, { w: 800, c: '#fff' });
			k.text(k.t('Continua con Facebook', 'Continue with Facebook'), W / 2 + 10, 817, 21, { w: 700, c: '#fff', a: 'center', ls: 1 });
			k.rect(22, 852, W - 44, 64, 6, '#fff'); googleG(k, 56, 884, 32);
			k.text(k.t('Continua con Google', 'Continue with Google'), W / 2 + 10, 893, 21, { w: 600, c: '#757575', a: 'center', ls: 1 });
			const out = { r: 6, stroke: '#fff', lw: 2, size: 22, w: 600, ls: 1.5 };
			k.btn(22, 930, 242, 62, k.t('Registrati', 'Sign up'), out);
			k.btn(276, 930, 242, 62, k.t('Accedi', 'Log in'), Object.assign({ act: { go: 'home' } }, out));
			k.wrap(k.t('Registrandoti dichiari di accettare i nostri Termini e Condizioni di utilizzo.', 'By signing up you accept our Terms and Conditions of use.'), W / 2, 1062, 450, 18, 26, { c: '#fff', a: 'center' });
		},
		home(k) {
			k.fill('#f1f5f7');
			keikenHead(k);
			k.rect(0, 154, W, 146, 0, KB);
			k.icon('search', 42, 190, 28, '#fff');
			k.text(k.t('Località', 'Location'), 68, 199, 22, { c: 'rgba(255,255,255,.78)' });
			k.line([[24, 216], [W - 24, 216]], 'rgba(255,255,255,.7)', 2);
			chipRow(k, k.en ? ['Culture', 'Sport', 'Music', 'Food'] : ['Cultura', 'Sport', 'Musica', 'Cibo'], 24, 236, { size: 19, pad: 17, h: 44, fill: KBL, c: '#fff' });
			k.text(k.t('Esperienze', 'Experiences'), 24, 348, 28, { w: 700, c: '#102a36' });
			EXP(k).forEach((c, i) => {
				const Y = 372 + i * 330;
				k.shadow('rgba(16,42,54,.16)', 20, 8); k.rect(20, Y, W - 40, 312, 18, '#fff'); k.shadow();
				k.img(c.img, 20, Y, W - 40, 172, 18);
				k.rect(20, Y + 150, W - 40, 24, 0, '#fff');
				k.circle(W - 70, Y + 150, 32, KB, '#fff', 4);
				k.text(c.price, W - 70, Y + 151, 21, { w: 700, c: '#fff', a: 'center', b: 'middle' });
				k.text(c.cat, 40, Y + 192, 17, { c: KB, w: 500 });
				k.text(c.title, 40, Y + 230, 26, { w: 700, c: '#102a36' });
				k.icon('pin', 50, Y + 262, 22, '#7a8a92'); k.text('Bologna', 68, Y + 270, 19, { c: '#5c6b73' });
				stars(k, 170, Y + 262, c.n, 20, '#f5b301', '#d5dbe0');
				if (c.me) k.img(P + 'me.jpg', W - 196, Y + 244, 38, 38, 19);
				else { k.circle(W - 177, Y + 263, 19, KBL); k.text('G', W - 177, Y + 264, 19, { w: 700, c: '#fff', a: 'center', b: 'middle' }); }
				k.text(c.host, W - 148, Y + 270, 19, { c: '#3c4a52' });
				if (!i) k.hot(20, Y, W - 40, 312, { go: 'detail' });
			});
			k.rect(0, H - 112, W, 112, 0, '#fff'); k.line([[0, H - 112], [W, H - 112]], '#e2e8ec', 2);
			['home', 'grid', 'user', 'heart', 'chat'].forEach((n, i) => k.icon(n, 54 + i * 108, H - 70, 30, i ? '#5f6b72' : KB));
			k.text('Home', 54, H - 32, 14, { c: KB, a: 'center' });
		},
		detail(k) {
			k.fill('#ffffff');
			k.img(P + 'bologna.jpg', 0, 0, W, 352, 0, { shade: 'rgba(0,0,0,.26)' });
			k.status('#fff');
			k.icon('arrow', 44, 100, 34, '#fff', 2.6); k.hot(0, 54, 120, 96, { go: 'home', back: 1 });
			k.text(k.t('A piedi a San Luca', 'A walk to San Luca'), 26, 322, 38, { w: 500, c: '#fff' });
			let y = k.wrap(k.t('Passeggiata guidata lungo il portico fino al Santuario della Madonna di San Luca, tra curiosità e panorama sulla città.',
				'A guided walk along the portico up to the Sanctuary of the Madonna di San Luca, with stories and a view over the city.'), 26, 400, W - 52, 19, 27, { c: '#222' });
			k.icon('pin', W / 2 - 58, y + 14, 24, '#111'); k.text('Bologna', W / 2 - 38, y + 22, 21, { c: '#222' });
			chipRowCentered(k, k.en ? ['Culture', 'Sport', 'Fun'] : ['Cultura', 'Sport', 'Divertimento'], y + 46, { size: 17, pad: 16, h: 38, fill: '#eceff1', c: '#333' });
			y += 122;
			k.icon('cal', 50, y + 22, 26, '#111');
			const seats = k.t('Posti disponibili', 'Places available');
			['Sun Sep 15 2019 (' + seats + ': 35)', 'Tue Sep 17 2019 (' + seats + ': 31)', 'Wed Sep 18 2019 (' + seats + ': 35)'].forEach((d, i) => k.text(d, 88, y + 6 + i * 27, 18, { c: '#222' }));
			y += 96;
			k.icon('clock', W / 2 - 42, y, 22, '#111'); k.text('17:30', W / 2 - 24, y + 8, 20, { c: '#222' });
			k.text(k.t('Prezzo a persona: 3€', 'Price per person: €3'), W / 2, y + 48, 20, { c: '#222', a: 'center' });
			const booked = k.state.booked;
			k.btn(20, y + 66, W - 40, 64, booked ? k.t('Esperienza prenotata  ✓', 'Experience booked  ✓') : k.t('Prenota esperienza', 'Book experience'), { r: 4, fill: booked ? '#2e9e6b' : KB, size: 21, w: 700, ls: 1.5, act: { set: { booked: !booked } } });
			y += 172;
			k.text(k.t('14 Recensioni', '14 Reviews'), W / 2, y, 21, { w: 700, a: 'center', c: '#111' });
			stars(k, W / 2 - 62, y + 26, 4, 22, '#f5b301', '#cfd5da');
			k.text(k.t('Visualizza recensioni', 'View reviews'), W / 2, y + 78, 18, { c: '#222', a: 'center' });
			k.line([[W / 2 - 86, y + 84], [W / 2 + 86, y + 84]], '#222', 1.5);
			k.text('Salvatore', W / 2 + 4, y + 132, 22, { c: '#222', a: 'right' });
			k.img(P + 'me.jpg', W / 2 + 18, y + 104, 44, 44, 22);
		}
	} };

	/* ----------------------------------------------------- Remote Control Car */

	const RC = { bar: '#263238', bg: '#eceff1', teal: '#00897b' };
	const PAD = [['up', W / 2, 706, 0], ['left', 124, 856, -90], ['right', 416, 856, 90], ['down', W / 2, 1006, 180]];

	// hints: false -> no beacons (the pad speaks for itself); hold: true -> the hint says "hold the arrows".
	apps.rccar = { start: 'pad', order: ['pad'], auto: false, hints: false, hold: true, screens: {
		pad(k) {
			k.fill(RC.bg);
			k.status('#fff', '#1b2327');
			k.rect(0, 54, W, 96, 0, RC.bar);
			k.text('Remote Control Car', 30, 114, 30, { w: 500, c: '#fff' });
			k.rect(24, 172, W - 48, 58, 29, '#fff');
			k.circle(56, 201, 8, '#2ecc71');
			k.text('TCP socket · 192.168.4.1:8080', 78, 208, 18, { c: '#37474f', f: MONO, w: 500 });
			k.rect(24, 250, W - 48, 300, 24, '#11181c');
			k.circle(52, 284, 6, '#ff5252'); k.text('LIVE', 66, 291, 17, { w: 700, c: '#ff5252', f: MONO, ls: 2 });
			PAD.forEach(b => {
				k.shadow('rgba(38,50,56,.22)', 20, 9); k.circle(b[1], b[2], 78, '#fff'); k.shadow();
				arrowAt(k, b[1], b[2], b[3], RC.teal, 66);
				k.hot(b[1] - 86, b[2] - 86, 172, 172, { hold: b[0] });
			});
			k.circle(W / 2, 856, 46, '#cfd8dc');
			k.text('STOP', W / 2, 857, 17, { w: 700, c: '#546e7a', a: 'center', b: 'middle', f: MONO });
			k.home('#90a4ae');
			return { live(q, env) {
				const c = env.car || { v: 0, heading: 0, pressed: {} }, x = q.x;
				PAD.forEach(b => { if (c.pressed[b[0]]) { q.circle(b[1], b[2], 78, RC.teal); arrowAt(q, b[1], b[2], b[3], '#fff', 66); } });
				// telemetry: a top-down car that turns with the real one, over a moving grid
				x.save(); q.path(24, 250, W - 48, 300, 24); x.clip();
				const off = (env.t * 60 * c.v) % 44;
				x.strokeStyle = 'rgba(255,255,255,.07)'; x.lineWidth = 2;
				for (let i = -1; i < 14; i++) { const gx = 24 + i * 44 - off * Math.cos(c.heading); x.beginPath(); x.moveTo(gx, 250); x.lineTo(gx, 550); x.stroke(); }
				for (let j = -1; j < 9; j++) { const gy = 250 + j * 44 + off * Math.sin(c.heading); x.beginPath(); x.moveTo(24, gy); x.lineTo(W - 24, gy); x.stroke(); }
				x.translate(W / 2, 410); x.rotate(-c.heading);
				q.rect(-50, -18, 20, 10, 4, '#0b0f12'); q.rect(26, -18, 20, 10, 4, '#0b0f12');
				q.rect(-50, 8, 20, 10, 4, '#0b0f12'); q.rect(26, 8, 20, 10, 4, '#0b0f12');
				q.rect(-56, -24, 112, 48, 16, '#2f7de1');
				q.rect(-22, -18, 44, 36, 9, '#9fd0ff');
				q.rect(50, -18, 7, 10, 3, '#ffe082'); q.rect(50, 8, 7, 10, 3, '#ffe082');
				x.restore();
				q.text(Math.round(Math.abs(c.v) * 22) + ' km/h', W - 48, 292, 20, { a: 'right', c: '#fff', f: MONO, w: 600 });
				q.text(q.t('Tieni premuta una freccia', 'Hold an arrow'), W / 2, 528, 16, { a: 'center', c: 'rgba(255,255,255,.5)', f: MONO });
			} };
		}
	} };

	/* -------------------------------------------------------------- Musixgame */

	const MP = '#ff5353', MPD = '#c5112a';
	const mxBg = () => edgeColor(P + 'mx-logo.jpg', 'rgb(255,135,128)');
	const mxBtn = (k, X, Y, w, label, act) => k.btn(X, Y, w, 64, label, { r: 6, fill: MP, size: 21, w: 700, ls: 1.6, sh: 1, act });

	// a few faint notes, so the flat brand colour does not look empty
	function notes(k) {
		const x = k.x;
		[[70, 140, 1.5, -0.2], [440, 200, 1.1, 0.25], [470, 640, 1.9, -0.1], [60, 700, 1.3, 0.2], [420, 1040, 1.6, 0.15], [110, 1060, 1.1, -0.25]].forEach(n => {
			x.save(); x.translate(n[0], n[1]); x.rotate(n[3]); x.scale(n[2], n[2]);
			x.fillStyle = 'rgba(255,255,255,.13)'; x.strokeStyle = 'rgba(255,255,255,.13)'; x.lineWidth = 4; x.lineCap = 'round';
			x.beginPath(); x.ellipse(0, 0, 13, 10, -0.4, 0, 6.2832); x.fill();
			x.beginPath(); x.moveTo(11, -3); x.lineTo(11, -52); x.quadraticCurveTo(26, -44, 30, -28); x.stroke();
			x.restore();
		});
	}
	function mxTop(k, title) {
		k.status('#fff', MPD);
		k.rect(0, 54, W, 96, 0, MP);
		k.text(title || 'Musixgame', 30, 114, 34, { w: 500, c: '#fff' });
		k.rect(W - 176, 82, 152, 42, 21, 'rgba(255,255,255,.22)');
		k.text('1380 pts', W - 100, 110, 19, { w: 700, c: '#fff', a: 'center', f: MONO });
	}
	function mxNav(k, active) {
		k.rect(0, H - 118, W, 118, 0, '#fff'); k.line([[0, H - 118], [W, H - 118]], '#ececec', 2);
		[['home', 'Home', 'home'], ['chart', k.t('Classifica', 'Leaderboard'), 'board'], ['user', k.t('Profilo', 'Profile'), null]].forEach((n, i) => {
			const cx = 90 + i * 180, c = i === active ? MP : '#8a8a8a';
			k.icon(n[0], cx, H - 80, 30, c); k.text(n[1], cx, H - 38, 16, { c, a: 'center' });
			if (i !== active && n[2]) k.hot(cx - 90, H - 118, 180, 118, { go: n[2], back: i < active ? 1 : 0 });
		});
	}

	apps.musixgame = { start: 'signin', order: ['signin', 'login', 'home', 'who', 'win', 'board'], screens: {
		signin(k) {
			k.fill(mxBg()); notes(k); k.status('#fff', MPD);
			k.soft(P + 'mx-logo.jpg', 70, 230, 400, 337, mxBg(), 24);
			k.text(k.t('Indovina la parola. Indovina chi canta.', 'Guess the word. Guess the singer.'), W / 2, 640, 22, { c: '#fff', a: 'center' });
			mxBtn(k, 120, 800, 300, k.t('ACCEDI', 'LOGIN'), { go: 'login' });
			k.btn(120, 884, 300, 64, k.t('REGISTRATI', 'SIGNUP'), { r: 6, stroke: '#fff', lw: 2.5, size: 21, w: 700, ls: 1.6 });
		},
		login(k) {
			k.fill(mxBg()); notes(k); k.status('#fff', MPD);
			k.soft(P + 'mx-logo.jpg', 120, 170, 300, 253, mxBg(), 20);
			[['Email', 's.matrisciano@mail.com'], ['Password', '••••••••']].forEach((f, i) => {
				const Y = 520 + i * 96;
				k.rect(90, Y, 360, 78, 6, 'rgba(255,255,255,.28)');
				k.text(f[0], 108, Y + 26, 15, { c: 'rgba(255,255,255,.9)' });
				k.text(f[1], 108, Y + 58, 21, { c: '#fff' });
				k.line([[90, Y + 78], [450, Y + 78]], '#fff', 2);
			});
			mxBtn(k, 120, 750, 300, k.t('ACCEDI', 'LOGIN'), { go: 'home' });
			k.text(k.t('Password dimenticata?', 'Forgot your password?'), W / 2, 880, 19, { c: '#fff', a: 'center' });
			k.text(k.t('Non hai un account?  Registrati', 'No account yet?  Sign up'), W / 2, 1066, 19, { c: '#fff', a: 'center', w: 600 });
		},
		home(k) {
			k.fill('#fbf3f3'); mxTop(k);
			[[k.t('Gioco 1', 'Game 1'), k.t('Indovina la parola mancante', 'Guess the missing word'), k.t('INDOVINA LA PAROLA! 🎤', 'GUESS THE WORD! 🎤'), 1],
				[k.t('Gioco 2', 'Game 2'), k.t('Indovina chi canta', 'Guess the singer'), k.t('CHI CANTA? 🎤', 'WHO SINGS? 🎤'), 0]].forEach((g, i) => {
				const Y = i ? 620 : 186, hh = i ? 290 : 410;
				k.shadow('rgba(197,17,42,.14)', 22, 8); k.rect(24, Y, W - 48, hh, 20, '#fff'); k.shadow();
				k.text(g[0].toUpperCase(), 52, Y + 50, 17, { w: 700, c: MP, f: MONO, ls: 2 });
				k.text(g[1], 52, Y + 92, 27, { w: 700, c: '#1c1c1c' });
				let by = Y + 130;
				if (g[3]) {
					[k.t('Titolo', 'Title'), k.t('Artista', 'Artist')].forEach((f, j) => { k.text(f, 56, Y + 152 + j * 72, 20, { c: '#9a9a9a' }); k.line([[52, Y + 168 + j * 72], [W - 52, Y + 168 + j * 72]], '#cfcfcf', 2); });
					by = Y + 300;
				} else k.text(k.t('Tre artisti, dieci secondi per rispondere.', 'Three artists, ten seconds to answer.'), 52, Y + 132, 19, { c: '#666' });
				mxBtn(k, 52, g[3] ? by : Y + 180, W - 104, g[2], g[3] ? null : { go: 'who' });
			});
			mxNav(k, 0);
		},
		who(k) {
			k.fill(mxBg()); notes(k); k.status('#fff', MPD);
			k.text(k.t('CHI CANTA?', 'WHO SINGS?'), W / 2, 150, 19, { w: 700, c: 'rgba(255,255,255,.85)', a: 'center', f: MONO, ls: 3 });
			k.wrap(k.t('«…e questa, chi la sta cantando?»', '“…and who is singing this one?”'), W / 2, 250, 430, 34, 46, { c: '#fff', a: 'center' });
			['Ultimo', 'Camila Cabello', 'Purple Disco Machine'].forEach((a, i) => mxBtn(k, 60, 400 + i * 100, 420, a, i === 2 ? { go: 'win' } : null));
			return { live(q, env) {
				const left = 10 - (env.t % 10), x = q.x;
				q.circle(W / 2, 850, 78, null, 'rgba(255,255,255,.3)', 9);
				x.beginPath(); x.arc(W / 2, 850, 78, -Math.PI / 2, -Math.PI / 2 + (left / 10) * 6.2832);
				x.strokeStyle = '#fff'; x.lineWidth = 9; x.lineCap = 'round'; x.stroke();
				q.text(String(Math.ceil(left)), W / 2, 852, 60, { c: '#fff', a: 'center', b: 'middle', w: 600 });
			} };
		},
		win(k) {
			k.fill(mxBg()); notes(k); k.status('#fff', MPD);
			k.text('🎉', W / 2, 400, 150, { a: 'center', f: EM });
			k.text('+5', W / 2, 560, 110, { w: 800, c: '#fff', a: 'center' });
			k.wrap(k.t('Complimenti, hai vinto 5 Musixpoints!', 'Congratulations, you won 5 Musixpoints!'), W / 2, 640, 400, 28, 40, { c: '#fff', a: 'center', w: 500 });
			mxBtn(k, 150, 780, 240, 'OK', { go: 'board' });
		},
		board(k) {
			k.fill('#fbf3f3'); mxTop(k, k.t('Classifica', 'Leaderboard'));
			[['s.matrisciano@mail.com', 1385], ['giulia.b@mail.com', 193], ['marco.r@mail.com', 41], ['anna.v@mail.com', 34], ['luca.t@mail.com', 18], ['sara.m@mail.com', 15], ['paolo.d@mail.com', 7], ['elena.f@mail.com', 3], ['davide.p@mail.com', 2]]
				.forEach((r, i) => {
					const Y = 176 + i * 92, me = !i;
					k.rect(20, Y, W - 40, 80, 16, me ? MP : '#fff');
					k.circle(64, Y + 40, 24, me ? 'rgba(255,255,255,.25)' : '#ffe1e1');
					k.text(String(i + 1), 64, Y + 41, 22, { w: 800, c: me ? '#fff' : MP, a: 'center', b: 'middle' });
					k.text(r[0], 104, Y + 48, 20, { w: me ? 700 : 500, c: me ? '#fff' : '#222' });
					k.text(String(r[1]), W - 44, Y + 48, 22, { w: 800, c: me ? '#fff' : MP, a: 'right', f: MONO });
				});
			mxNav(k, 1);
		}
	} };

	/* ---------------------------------------------------------------- Visitup */

	const vuBlue = () => edgeColor(P + 'vis-logo.jpg', 'rgb(62,128,169)');
	function apple(k, cx, cy) { // a small Apple-like mark, drawn so it works on every device
		const x = k.x;
		x.fillStyle = '#fff';
		x.beginPath(); x.arc(cx - 5, cy + 3, 9, 0, 6.2832); x.arc(cx + 5, cy + 3, 9, 0, 6.2832); x.fill();
		x.beginPath(); x.ellipse(cx + 3, cy - 12, 3, 6, 0.7, 0, 6.2832); x.fill();
		x.fillStyle = '#111'; x.beginPath(); x.arc(cx + 15, cy + 1, 5.5, 0, 6.2832); x.fill();
	}

	apps.visitup = { start: 'login', order: ['login', 'home', 'tour', 'player'], screens: {
		login(k) {
			const c = vuBlue();
			k.fill(c); k.status('#fff');
			k.soft(P + 'vis-logo.jpg', 120, 78, 300, 356, c, 40);
			k.rect(0, 462, W, H, 44, '#fff');
			[['Email', 'at'], ['Password', 'lock']].forEach((f, i) => {
				const Y = 500 + i * 88;
				k.rect(36, Y, W - 72, 66, 33, '#e4ecf2');
				k.icon(f[1], 78, Y + 33, 24, c);
				k.text(f[0], 106, Y + 41, 20, { c: '#7fa5bd' });
			});
			k.icon('eye', 468, 621, 26, c);
			k.btn(36, 680, W - 72, 64, k.t('Accedi', 'Login'), { fill: c, size: 21, w: 600, act: { go: 'home' } });
			k.text(k.t('Password dimenticata?', 'Forgot password?'), W / 2, 802, 19, { c, a: 'center' });
			k.text(k.t('O continua con', 'Or continue with'), W / 2, 884, 19, { c, a: 'center' });
			k.circle(190, 952, 31, '#4267b2'); k.text('f', 190, 965, 38, { w: 800, c: '#fff', a: 'center' });
			k.shadow('rgba(0,0,0,.2)', 10, 3); k.circle(270, 952, 31, '#fff'); k.shadow(); googleG(k, 270, 952, 32);
			k.circle(350, 952, 31, '#111'); apple(k, 350, 952);
			k.text(k.t('Non hai un account?  Registrati', 'Don’t have an account?  Register'), W / 2, 1072, 19, { c, a: 'center' });
			k.home('#111');
		},
		home(k) {
			const c = vuBlue();
			k.fill(c); k.status('#fff');
			k.soft(P + 'vis-logo.jpg', 196, 58, 148, 176, c, 22);
			k.icon('user', 486, 112, 36, '#fff');
			k.rect(0, 250, W, H, 44, '#fff');
			(k.en ? [[P + 'vis-tour1.jpg', 'Historical Tour', 'Discover Bologna, its monuments and its history', '3 days  ·  audioguides'],
				[P + 'vis-tour2.jpg', 'Restaurant Tour', 'Eat the best local food in the selected restaurants', '4 cuisines']]
				: [[P + 'vis-tour1.jpg', 'Tour storico', 'Scopri Bologna, i suoi monumenti e la sua storia', '3 giorni  ·  audioguide'],
					[P + 'vis-tour2.jpg', 'Tour dei ristoranti', 'Mangia il miglior cibo locale nei ristoranti scelti', '4 cucine']]).forEach((d, i) => {
				const Y = 284 + i * 440;
				k.shadow('rgba(20,50,80,.18)', 24, 8); k.rect(28, Y, W - 56, 416, 28, '#fff'); k.shadow();
				k.img(d[0], 42, Y + 14, W - 84, 250, 20);
				k.text(d[1], W / 2, Y + 310, 27, { w: 500, a: 'center', c: '#111' });
				k.text(d[2], W / 2, Y + 346, 17, { a: 'center', c: '#444' });
				k.text(d[3], W / 2, Y + 388, 17, { a: 'center', c: '#333' });
				if (!i) k.hot(28, Y, W - 56, 416, { go: 'tour' });
			});
			k.home('#111');
		},
		tour(k) {
			const c = vuBlue();
			k.fill('#ffffff');
			k.img(P + 'bologna.jpg', 0, 0, W, 340, 0, { shade: 'rgba(0,0,0,.2)' });
			k.status('#fff');
			k.icon('back', 44, 104, 34, '#fff', 2.8); k.hot(0, 54, 120, 100, { go: 'home', back: 1 });
			k.text(k.t('Giorno 1', 'Day 1'), 46, 312, 44, { c: '#fff' });
			let y = k.wrap(k.t('Bologna è una città davvero fantastica! “La Dotta, la Grassa, la Rossa” ospita l’università più antica del mondo occidentale, nata nel 1088.',
				'Bologna is a truly fantastic city! “The Learned, the Fat, the Red” hosts the oldest university in the western world, dating back to 1088.'), 28, 394, W - 56, 19, 28, { c: '#222' });
			k.text(k.t('Programma del giorno 1', 'Day 1 programme'), 28, y + 24, 23, { c, w: 500 });
			y += 60;
			(k.en ? ['Piazza Maggiore with its monuments: 2 hours', 'Quadrilatero and old market: 1 hour', 'The 2 Towers and Piazza della Mercanzia: 1 hour']
				: ['Piazza Maggiore con i suoi monumenti: 2 ore', 'Quadrilatero e mercato antico: 1 ora', 'Le Due Torri e Piazza della Mercanzia: 1 ora'])
				.forEach(b => { y = k.wrap('• ' + b, 28, y, W - 56, 19, 28, { c: '#222' }); });
			y += 14;
			k.shadow('rgba(20,50,80,.18)', 22, 8); k.rect(28, y, W - 56, 118, 24, '#fff'); k.shadow();
			cityMap(k, 44, y + 14, 112, 90, {});
			k.text(k.t('Mappa del Tour', 'Tour Map'), 176, y + 54, 23, { w: 500, c: '#111' });
			k.text(k.t('Scopri i luoghi più vicini a te', 'Discover the best places near you'), 176, y + 86, 15, { c: '#555' });
			y += 136;
			k.shadow('rgba(20,50,80,.18)', 22, 8); k.rect(28, y, W - 56, 132, 24, '#fff'); k.shadow();
			k.img(P + 'vis-basilica.jpg', 42, y + 14, 132, 104, 16);
			k.text('Basilica di San Petronio', 190, y + 46, 21, { w: 500, c: '#111' });
			k.icon('pin', 198, y + 74, 20, '#e04a3a'); k.text('Piazza Maggiore', 214, y + 81, 16, { c: '#555' });
			k.icon('star', 198, y + 104, 18, '#f5b301'); k.text('4.9  ·  audio 02:41', 214, y + 110, 16, { c: '#555' });
			k.hot(28, y, W - 56, 132, { go: 'player' });
			// the three days of the tour, as a stepper
			k.line([[134, 1036], [406, 1036]], '#dbe6ee', 4);
			[1, 2, 3].forEach((d, i) => {
				const cx = 134 + i * 136;
				k.circle(cx, 1036, 24, i ? '#fff' : c, i ? '#c5d5e0' : c, 2.5);
				k.text(String(d), cx, 1037, 21, { w: 600, c: i ? '#7f93a1' : '#fff', a: 'center', b: 'middle' });
				k.text(k.t('Giorno ', 'Day ') + d, cx, 1092, 16, { c: i ? '#7f93a1' : c, a: 'center' });
			});
			k.home('#111');
		},
		player(k) {
			const c = vuBlue();
			k.fill('#ffffff');
			k.img(P + 'vis-basilica.jpg', 0, 0, W, 330, 0, { shade: 'rgba(0,0,0,.2)' });
			k.status('#fff');
			k.icon('back', 44, 104, 34, '#fff', 2.8); k.hot(0, 54, 120, 100, { go: 'tour', back: 1 });
			k.text('Basilica di San Petronio', 28, 304, 34, { w: 500, c: '#fff' });
			k.shadow('rgba(20,50,80,.18)', 22, 8); k.rect(28, 356, W - 56, 204, 26, '#fff'); k.shadow();
			k.hot(W / 2 - 60, 462, 120, 96, { toggle: 'playing' });
			k.icon('pin', 58, 612, 24, '#e04a3a'); k.text('Piazza Maggiore, Bologna', 80, 620, 19, { c: '#222' });
			k.icon('star', 384, 612, 22, '#f5b301'); k.text('4.9', 402, 620, 19, { c: '#222' });
			k.icon('clock', 58, 658, 22, c, 2); k.text(k.t('8:30 – 13:00, 14:30 – 18:00', '8:30AM – 1PM, 2:30PM – 6PM'), 80, 666, 19, { c: '#222' });
			const y = k.wrap(k.t('Dedicata dal Comune al santo patrono della città. Con i suoi 132 metri di lunghezza e 60 di larghezza è la quinta chiesa più grande del mondo.',
				'Dedicated by the Council to the patron saint of the city. With its 132 meters in length and 60 meters in width, it is the fifth biggest church in the world.'), 28, 728, W - 56, 19, 28, { c: '#222' });
			k.text(k.t('La costruzione', 'The construction'), 28, y + 26, 23, { c, w: 500 });
			const y2 = k.wrap(k.t('I lavori iniziarono nel giugno 1390 e terminarono nel 1659.', 'Building began in June 1390 and finished in 1659.'), 28, y + 66, W - 56, 19, 28, { c: '#222' }) + 8;
			k.shadow('rgba(20,50,80,.18)', 22, 8); k.rect(28, y2, W - 56, 132, 24, '#fff'); k.shadow();
			k.img(P + 'vis-tour1.jpg', 42, y2 + 14, 132, 104, 16);
			k.text(k.t('PROSSIMA TAPPA', 'NEXT STOP'), 192, y2 + 42, 15, { w: 600, c, f: MONO, ls: 1.5 });
			k.text(k.t('Fontana del Nettuno', 'Fountain of Neptune'), 192, y2 + 76, 22, { w: 500, c: '#111' });
			k.text(k.t('2 minuti a piedi', '2 minutes on foot'), 192, y2 + 106, 16, { c: '#555' });
			k.home('#111');
			return { live(q, env) {
				const st = env.state, dur = 161;
				// pause keeps the position: `base` is where the track was at the last press of play (t0)
				if (st.playing) {
					if (st.from !== st.t0) { st.from = st.t0; st.base = st.pos || 0; }
					st.pos = (st.base + (env.now - st.t0) / 1000 * 5) % dur;
				}
				const s = st.pos || 0, p = s / dur;
				const mm = v => String(Math.floor(v / 60)).padStart(2, '0') + ':' + String(Math.floor(v % 60)).padStart(2, '0');
				q.text(mm(s), 58, 408, 21, { c: '#222' }); q.text('02:41', W - 58, 408, 21, { c: '#222', a: 'right' });
				q.line([[62, 444], [W - 62, 444]], '#dbe6ee', 6);
				if (p > 0) q.line([[62, 444], [62 + (W - 124) * p, 444]], c, 6);
				q.circle(62 + (W - 124) * p, 444, 12, c);
				q.circle(W / 2, 508, 32, c);
				q.icon(st.playing ? 'pause' : 'play', W / 2 + (st.playing ? 0 : 2), 508, 30, '#fff');
			} };
		}
	} };

	/* --------------------------------------------------------------- AI Pantry */

	const AP = { bg: '#f6f7f3', on: '#111813', pri: '#0b7a4b', priC: '#d3f4e1', v: '#e9ece6', onV: '#5b645d', out: '#c4cbc4', sec: '#d9540b', secC: '#ffe9da' };
	const FRIDGE = [['🥚', 'Uova', 'Eggs', '#ffe9da'], ['🍆', 'Melanzana', 'Aubergine', '#ecdff8'], ['🥛', 'Latte', 'Milk', '#e3eef9'], ['🥗', 'Insalata mista', 'Mixed salad', '#ddf3df'],
		['🍋', 'Limoni', 'Lemons', '#fff3c4'], ['🍄', 'Funghi', 'Mushrooms', '#ffe3d6'], ['🫑', 'Peperoni', 'Peppers', '#ffe0e0'], ['🥬', 'Lattuga', 'Lettuce', '#ddf3df']];
	const RECIPES = [
		['🍝', 'Pasta al pomodoro e mozzarella', 'Pasta with tomato and mozzarella', '25 min', 0, '#ffe9da', 'Spaghetti, Pomodori, Mozzarella, Basilico', 'Spaghetti, Tomatoes, Mozzarella, Basil'],
		['🍚', 'Risotto ai funghi', 'Mushroom risotto', '45 min', 1, '#e3eef9', 'Funghi, Riso, Olio d’oliva, Parmigiano', 'Mushrooms, Rice, Olive oil, Parmesan'],
		['🍆', 'Melanzane al forno con ricotta', 'Baked aubergine with ricotta', '30 min', 0, '#ecdff8', 'Melanzana, Ricotta, Mozzarella, Pomodori', 'Aubergine, Ricotta, Mozzarella, Tomatoes'],
		['🥗', 'Insalata mista con tonno e capperi', 'Mixed salad with tuna and capers', '15 min', 0, '#ddf3df', 'Insalata mista, Limoni, Capperi', 'Mixed salad, Lemons, Capers']];
	const FOUND = [['Farina', 'Flour', 70, 430], ['Farro', 'Spelt', 196, 430], ['Orecchiette', 'Orecchiette', 70, 484], ['Olio d’oliva', 'Olive oil', 244, 484], ['Fusilli', 'Fusilli', 70, 538], ['Penne', 'Penne', 190, 538], ['Spaghetti', 'Spaghetti', 302, 538], ['Riso', 'Rice', 70, 592]];
	const LEVEL = k => [k.t('Facile', 'Easy'), k.t('Media', 'Medium')];

	function apPill(k, X, Y, label) {
		k.x.font = '500 17px ' + SANS;
		const w = k.x.measureText(label).width + 52;
		k.rect(X, Y, w, 40, 20, AP.v); k.circle(X + 20, Y + 20, 6, '#1fae6b');
		k.text(label, X + 36, Y + 26, 17, { w: 500, c: AP.onV });
	}
	function apBack(k, to) {
		k.shadow('rgba(0,0,0,.1)', 10, 3); k.circle(54, 104, 27, '#fff'); k.shadow();
		k.icon('arrow', 54, 104, 24, AP.on); k.hot(14, 64, 90, 84, { go: to, back: 1 });
	}

	apps.aipantry = { start: 'inventory', order: ['inventory', 'scan', 'recipes', 'detail'], screens: {
		inventory(k) {
			k.fill(AP.bg); k.status(AP.on);
			k.text(k.t('La tua cucina', 'Your kitchen'), 30, 146, 46, { w: 800, c: AP.on });
			k.text(k.t('15 ingredienti pronti da cucinare', '15 ingredients ready to cook'), 30, 184, 20, { c: AP.onV });
			apPill(k, 30, 204, 'Gemma 4 E2B · on device');
			k.rect(30, 272, 38, 38, 10, AP.priC); k.text('🧊', 49, 300, 22, { a: 'center', f: EM });
			k.text(k.t('Frigo', 'Fridge'), 80, 300, 26, { w: 700, c: AP.on });
			k.rect(k.en ? 168 : 154, 276, 44, 30, 15, AP.v); k.text('15', (k.en ? 168 : 154) + 22, 298, 17, { w: 600, c: AP.onV, a: 'center' });
			FRIDGE.forEach((f, i) => {
				const Y = 328 + i * 84;
				k.rect(24, Y, W - 48, 74, 22, '#fff');
				k.circle(66, Y + 37, 24, f[3]); k.text(f[0], 66, Y + 47, 26, { a: 'center', f: EM });
				k.text(k.t(f[1], f[2]), 108, Y + 45, 22, { w: 500, c: AP.on });
				k.icon('close', W - 62, Y + 37, 22, AP.onV, 2);
			});
			k.x.fillStyle = k.grad(0, 970, 0, 1050, ['rgba(246,247,243,0)', AP.bg]); k.x.fillRect(0, 970, W, 200);
			k.shadow('rgba(11,122,75,.38)', 22, 8); k.rect(24, 1052, 396, 78, 39, AP.pri); k.shadow();
			k.icon('spark', 62, 1091, 26, '#fff'); k.text(k.t('Cosa posso cucinare?', 'What can I cook?'), 88, 1099, 22, { w: 600, c: '#fff' });
			k.hot(24, 1046, 396, 90, { go: 'recipes' });
			k.circle(474, 1091, 39, AP.on); k.icon('camera', 474, 1091, 30, '#fff'); k.hot(428, 1046, 92, 90, { go: 'scan' });
		},
		scan(k) {
			const X = 40, Y = 150, w = 460, h = 650, cols = ['#c9a36b', '#b4472f', '#e3c16f', '#7a9a5b', '#d9d2c3', '#8a5a3b', '#c56b4a', '#a9b7c6'];
			k.fill('#0c0f0d'); k.status('#fff');
			k.rect(X, Y, w, h, 30, '#171c19');
			for (let r = 0; r < 4; r++) {
				const sy = Y + 34 + r * 152;
				for (let c = 0; c < 6; c++) {
					const jh = 70 + ((r * 7 + c * 13) % 5) * 12;
					k.rect(X + 26 + c * 70, sy + 124 - jh, 54, jh, 9, cols[(r * 3 + c * 5) % cols.length]);
					k.rect(X + 32 + c * 70, sy + 124 - jh - 10, 42, 12, 4, 'rgba(255,255,255,.35)');
				}
				k.rect(X + 14, sy + 124, w - 28, 12, 3, '#3a2f25');
			}
			k.rect(X, Y, w, h, 30, 'rgba(8,12,10,.35)');
			[[X, Y, 1, 1], [X + w, Y, -1, 1], [X, Y + h, 1, -1], [X + w, Y + h, -1, -1]].forEach(c => k.line([[c[0] + 46 * c[2], c[1]], [c[0], c[1]], [c[0], c[1] + 46 * c[3]]], '#5bd991', 5));
			k.circle(60, 100, 26, 'rgba(255,255,255,.16)'); k.icon('close', 60, 100, 22, '#fff'); k.hot(20, 60, 86, 84, { go: 'inventory', back: 1 });
			k.rect(176, 76, 256, 50, 25, 'rgba(255,255,255,.16)');
			k.text(k.t('Frigo', 'Fridge'), 232, 108, 19, { c: '#fff', a: 'center' });
			k.rect(294, 80, 134, 42, 21, '#fff'); k.text(k.t('Dispensa', 'Pantry'), 361, 108, 19, { w: 600, c: '#111', a: 'center' });
			k.rect(24, 830, W - 48, 150, 28, 'rgba(255,255,255,.11)');
			k.text(k.t('Riconosco gli ingredienti', 'Recognising the ingredients'), 92, 880, 23, { w: 700, c: '#fff' });
			k.text(k.t('On device · la foto resta sul telefono', 'On device · the photo stays on the phone'), 92, 910, 16, { c: 'rgba(255,255,255,.7)' });
			k.btn(24, 1004, W - 48, 76, k.t('Vedi le ricette', 'See the recipes'), { fill: '#5bd991', c: '#00391f', size: 23, w: 700, act: { go: 'recipes' } });
			return { live(q, env) {
				const x = q.x, p = (env.t % 8) / 8;
				const ly = Y + 24 + (h - 48) * (0.5 - 0.5 * Math.cos(env.t * 1.5));
				x.fillStyle = q.grad(0, ly - 40, 0, ly, ['rgba(91,217,145,0)', 'rgba(91,217,145,.45)']); x.fillRect(X + 8, ly - 40, w - 16, 40);
				q.line([[X + 8, ly], [X + w - 8, ly]], '#5bd991', 3);
				FOUND.forEach((f, i) => {
					if (p < (i + 1) / (FOUND.length + 2)) return;
					const label = q.t(f[0], f[1]);
					x.font = '600 17px ' + SANS;
					q.rect(f[2], f[3], x.measureText(label).width + 34, 40, 12, 'rgba(12,20,16,.82)', '#5bd991', 2);
					q.text(label, f[2] + 17, f[3] + 27, 17, { w: 600, c: '#fff' });
				});
				x.beginPath(); x.arc(58, 876, 14, env.t * 5, env.t * 5 + 4.4); x.strokeStyle = '#fff'; x.lineWidth = 3.5; x.lineCap = 'round'; x.stroke();
				q.rect(48, 942, 380, 8, 4, 'rgba(255,255,255,.22)'); q.rect(48, 942, Math.max(8, 380 * p), 8, 4, '#fff');
				q.text(Math.round(p * 100) + '%', W - 48, 952, 18, { w: 600, c: '#fff', a: 'right' });
			} };
		},
		recipes(k) {
			k.fill(AP.bg); k.status(AP.on);
			apBack(k, 'inventory');
			k.shadow('rgba(0,0,0,.1)', 10, 3); k.circle(W - 54, 104, 27, '#fff'); k.shadow(); k.icon('refresh', W - 54, 104, 24, AP.on);
			if (k.en) { k.text('Here is what you', 30, 192, 38, { w: 800, c: AP.on }); k.text('can cook', 30, 236, 38, { w: 800, c: AP.on }); }
			else { k.text('Ecco cosa puoi', 30, 192, 38, { w: 800, c: AP.on }); k.text('cucinare', 30, 236, 38, { w: 800, c: AP.on }); }
			k.text(k.t('Idee pensate per i tuoi 15 ingredienti', 'Ideas for your 15 ingredients'), 30, 270, 18, { c: AP.onV });
			apPill(k, 30, 288, 'Gemma 4 E2B · LiteRT · on device');
			RECIPES.forEach((r, i) => {
				const Y = 350 + i * 172;
				k.rect(24, Y, W - 48, 158, 26, '#fff');
				k.rect(42, Y + 20, 76, 76, 20, r[5]); k.text(r[0], 80, Y + 73, 40, { a: 'center', f: EM });
				k.wrap(k.t(r[1], r[2]), 136, Y + 46, 310, 21, 27, { w: 600, c: AP.on, max: 2 });
				k.icon('clock', 146, Y + 104, 18, AP.onV, 2); k.text(r[3] + '  ·  ' + LEVEL(k)[r[4]], 162, Y + 110, 16, { c: AP.onV });
				k.text(k.t(r[6], r[7]), 42, Y + 140, 15, { c: AP.onV });
				k.icon('chev', W - 56, Y + 62, 22, AP.onV);
				k.hot(24, Y, W - 48, 158, { set: { recipe: i }, go: 'detail' });
			});
			k.rect(24, 1050, W - 48, 66, 33, '#fff', AP.out, 2);
			k.icon('spark', W / 2 - 84, 1083, 22, AP.on); k.text(k.t('Altre ricette', 'More recipes'), W / 2 - 62, 1091, 20, { w: 600, c: AP.on });
			k.home(AP.on);
		},
		detail(k) {
			const r = RECIPES[k.state.recipe || 0], ing = k.t(r[6], r[7]).split(', ');
			k.fill(AP.bg);
			k.rect(0, 0, W, 330, 0, r[5]);
			k.status(AP.on);
			apBack(k, 'recipes');
			k.text(r[0], W / 2, 262, 130, { a: 'center', f: EM });
			let y = k.wrap(k.t(r[1], r[2]), 30, 398, W - 60, 32, 40, { w: 800, c: AP.on });
			k.rect(24, y, W - 48, 98, 24, '#fff');
			[[k.t('Tempo', 'Time'), r[3]], [k.t('Difficoltà', 'Difficulty'), LEVEL(k)[r[4]]], [k.t('Ingredienti', 'Ingredients'), String(ing.length + 2)]].forEach((s, i) => {
				const cx = 24 + (W - 48) / 6 + i * (W - 48) / 3;
				k.text(s[1], cx, y + 46, 22, { w: 700, a: 'center', c: AP.on });
				k.text(s[0], cx, y + 74, 15, { a: 'center', c: AP.onV });
			});
			y += 142;
			k.text(k.t('Ingredienti dalla tua dispensa', 'Ingredients from your pantry'), 30, y, 21, { w: 700, c: AP.on });
			y = chipRow(k, ing, 30, y + 20, { size: 17, pad: 16, h: 40, fill: AP.priC, c: '#00391f', w: 600 }) + 50;
			k.text(k.t('Procedimento', 'Instructions'), 30, y, 21, { w: 700, c: AP.on });
			y += 46;
			(k.en ? ['Prepare the ingredients and bring them to room temperature.', 'Cook over medium heat with a drizzle of oil.', 'Combine everything, season with salt and serve at once.']
				: ['Prepara gli ingredienti e portali a temperatura ambiente.', 'Cuoci a fuoco medio con un filo d’olio.', 'Unisci tutto, aggiusta di sale e servi subito.']).forEach((s, i) => {
				k.circle(48, y, 17, AP.pri); k.text(String(i + 1), 48, y + 1, 17, { w: 700, c: '#fff', a: 'center', b: 'middle' });
				if (i < 2) k.line([[48, y + 22], [48, y + 54]], AP.out, 2);
				k.wrap(s, 82, y + 7, W - 116, 18, 25, { c: AP.on });
				y += 72;
			});
			const saved = k.state.saved;
			k.btn(24, 1052, W - 48, 72, saved ? k.t('Ricetta salvata  ✓', 'Recipe saved  ✓') : k.t('Salva la ricetta', 'Save the recipe'),
				{ fill: saved ? AP.priC : AP.pri, c: saved ? '#00391f' : '#fff', size: 22, w: 600, act: { set: { saved: !saved } } });
			k.home(AP.on);
		}
	} };

	/* ------------------------------------------------------------ talk video */

	apps.devfest = { start: 'video', order: ['video'], auto: false, screens: {
		video(k) {
			k.fill('#0b0d12');
			k.img('images/about/devfest-poster.jpg', 0, 0, W, H, 0, { ph: '#0b0d12' });
			k.hot(36, H - 152, W - 72, 78, { modal: 'devfest' });
			return { live(q, env) {
				const x = q.x, v = env.video;
				if (v && v.readyState >= 2) x.drawImage(v, 0, 0, W, H);
				x.fillStyle = q.grad(0, H - 440, 0, H, ['rgba(0,0,0,0)', 'rgba(0,0,0,.82)']); x.fillRect(0, H - 440, W, 440);
				q.text('DEVFEST MILANO 2026', 36, H - 252, 18, { w: 600, c: '#2dd4a7', f: MONO, ls: 2 });
				q.text('AI On-Device', 36, H - 196, 46, { w: 800, c: '#fff' });
				q.rect(36, H - 152, W - 72, 78, 39, '#fff');
				q.icon('play', 82, H - 113, 26, '#0b0d12');
				q.text(q.t('Guarda con l’audio', 'Watch with sound'), 112, H - 105, 23, { w: 700, c: '#0b0d12' });
			} };
		}
	} };

})();
